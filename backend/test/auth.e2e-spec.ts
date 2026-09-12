import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { AuthController } from '../module/auth/auth.controller';
import { AuthService } from '../module/auth/auth.service';
import { JwtGuard } from '../module/auth/guards/jwt-guard';
import { JwtStrategy } from '../module/auth/strategies/jwt.strategy';
import { AppValidationPipe } from '../src/common/pipes/app-validation.pipe';

describe('Authentication endpoints', () => {
  let app: INestApplication;
  let httpServer: Server;
  const jwtStrategy = { authenticate: jest.fn() };
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    me: jest.fn(),
    logout: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtGuard,
        { provide: JwtStrategy, useValue: jwtStrategy },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new AppValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    const nestHttpServer: unknown = app.getHttpServer();
    httpServer = nestHttpServer as Server;
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(async () => app.close());

  it('rejects malformed registration input before calling the service', async () => {
    await request(httpServer)
      .post('/api/auth/register')
      .send({ email: 'not-an-email' })
      .expect(400);

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('routes registration and login requests to the auth service', async () => {
    authService.register.mockResolvedValue({ success: true });
    authService.login.mockResolvedValue({
      success: true,
      data: { accessToken: 'token' },
    });
    const registration = {
      company_id: '22222222-2222-4222-8222-222222222222',
      email: 'jane@example.com',
      password_hash: 'correct-horse-battery-staple',
      first_name: 'Jane',
      last_name: 'Doe',
    };

    await request(httpServer)
      .post('/api/auth/register')
      .send(registration)
      .expect(201, { success: true });
    await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: registration.email,
        password_hash: registration.password_hash,
      })
      .expect(201, { success: true, data: { accessToken: 'token' } });
  });

  it('rejects missing, malformed, and expired tokens on protected routes', async () => {
    jwtStrategy.authenticate.mockRejectedValue(
      new UnauthorizedException('Invalid token'),
    );

    await request(httpServer).get('/api/auth/me').expect(401);
    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-jwt')
      .expect(401);
    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer expired-token')
      .expect(401);
  });

  it('passes a valid JWT subject to protected profile and logout actions', async () => {
    const userId = '11111111-1111-4111-8111-111111111111';
    jwtStrategy.authenticate.mockResolvedValue({
      sub: userId,
      email: 'jane@example.com',
    });
    authService.me.mockResolvedValue({
      success: true,
      data: { user: { id: userId } },
    });
    authService.logout.mockResolvedValue({ success: true });

    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200, { success: true, data: { user: { id: userId } } });
    await request(httpServer)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer valid-token')
      .expect(201, { success: true });

    expect(authService.me).toHaveBeenCalledWith(userId);
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });
});

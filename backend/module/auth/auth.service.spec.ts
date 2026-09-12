import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { user as PrismaUser } from '@/generated/prisma/client';
import { hash, verify } from '@/src/common/utils/password';
import { SecurityAuditService } from '@/module/security_audit/security-audit.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repository/auth.repository';

const rawPassword = 'correct-horse-battery-staple';
const user = {
  id: '11111111-1111-4111-8111-111111111111',
  company_id: '22222222-2222-4222-8222-222222222222',
  email: 'jane@example.com',
  first_name: 'Jane',
  last_name: 'Doe',
  status: 'ACTIVE',
  last_login_at: null,
} as unknown as PrismaUser;

describe('AuthService', () => {
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let securityAuditService: jest.Mocked<Pick<SecurityAuditService, 'create'>>;
  let service: AuthService;

  beforeEach(() => {
    authRepository = {
      login: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      register: jest.fn(),
    };
    jwtService = { signAsync: jest.fn() };
    securityAuditService = { create: jest.fn() };
    service = new AuthService(
      authRepository,
      jwtService as unknown as JwtService,
      securityAuditService as unknown as SecurityAuditService,
    );
  });

  it('hashes a registration password, returns a safe user, and records USER_CREATED', async () => {
    const dto = {
      company_id: user.company_id,
      email: user.email,
      password_hash: rawPassword,
      first_name: user.first_name,
      last_name: user.last_name,
    } as RegisterDto;
    authRepository.findByEmail.mockResolvedValue(null);
    authRepository.register.mockResolvedValue(user);
    securityAuditService.create.mockResolvedValue({} as never);

    const result = await service.register(dto, { ipAddress: '127.0.0.1' });
    const savedUser = authRepository.register.mock.calls[0][0];

    expect(savedUser.password_hash).not.toBe(rawPassword);
    await expect(verify(rawPassword, savedUser.password_hash)).resolves.toBe(
      true,
    );
    expect(result.data?.user).not.toHaveProperty('password_hash');
    expect(securityAuditService.create).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'USER_CREATED', user_id: user.id }),
    );
  });

  it('rejects duplicate registration before hashing or persisting', async () => {
    authRepository.findByEmail.mockResolvedValue(user);

    await expect(
      service.register(
        {
          company_id: user.company_id,
          email: user.email,
          password_hash: rawPassword,
          first_name: user.first_name,
          last_name: user.last_name,
        } as RegisterDto,
        {},
      ),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(authRepository.register).not.toHaveBeenCalled();
  });

  it('issues a token only after a valid password and records LOGIN_SUCCEEDED', async () => {
    authRepository.findByEmail.mockResolvedValue({
      ...user,
      password_hash: await hash(rawPassword),
    });
    jwtService.signAsync.mockResolvedValue('signed-token');
    securityAuditService.create.mockResolvedValue({} as never);

    await expect(
      service.login(
        { email: user.email, password_hash: rawPassword } as LoginDto,
        {},
      ),
    ).resolves.toEqual(
      expect.objectContaining({ data: { accessToken: 'signed-token' } }),
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
    expect(securityAuditService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: 'LOGIN_SUCCEEDED',
        user_id: user.id,
      }),
    );
  });

  async function expectGenericLoginFailure(
    foundUser: PrismaUser | null,
    password: string,
  ) {
    authRepository.findByEmail.mockResolvedValue(foundUser);
    securityAuditService.create.mockResolvedValue({} as never);

    await expect(
      service.login(
        { email: user.email, password_hash: password } as LoginDto,
        {},
      ),
    ).rejects.toMatchObject({
      status: 401,
      message: 'Invalid email or password',
    });
    expect(jwtService.signAsync).not.toHaveBeenCalled();
    expect(securityAuditService.create).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'LOGIN_FAILED' }),
    );
  }

  it('returns a generic 401 for an unknown email', async () => {
    await expectGenericLoginFailure(null, rawPassword);
  });

  it('returns the same generic 401 for a wrong password', async () => {
    await expectGenericLoginFailure(
      { ...user, password_hash: await hash('different-password') },
      rawPassword,
    );
  });
});

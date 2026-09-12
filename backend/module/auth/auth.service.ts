import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '@/module/auth/repository/auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hash, verify } from '@/src/common/utils/password';
import { apiResponse } from '@/src/common/responses/api-response';
import { SecurityAuditService } from '@/module/security_audit/security-audit.service';
import { security_event_type } from '@/generated/prisma/client';

type AuditRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly securityAuditService: SecurityAuditService,
  ) {}

  async login(dto: LoginDto, metadata: AuditRequestMetadata) {
    const user = await this.authRepository.findByEmail(dto.email);
    const passwordMatches = user
      ? await verify(dto.password_hash, user.password_hash)
      : false;

    if (!user || !passwordMatches) {
      await this.securityAuditService.create({
        ...(user
          ? {
              user_id: user.id,
              company_id: user.company_id,
              entity_id: user.id,
            }
          : {}),
        event_type: security_event_type.LOGIN_FAILED,
        entity_type: 'user',
        detail: 'Invalid login attempt',
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
      });

      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    await this.securityAuditService.create({
      user_id: user.id,
      company_id: user.company_id,
      event_type: security_event_type.LOGIN_SUCCEEDED,
      entity_type: 'user',
      entity_id: user.id,
      detail: 'User logged in',
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
    });

    return apiResponse.success('Login successful', { accessToken });
  }

  async register(dto: RegisterDto, metadata: AuditRequestMetadata) {
    const existingUser = await this.authRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const password_hash = await hash(dto.password_hash);
    const user = await this.authRepository.register({
      ...dto,
      password_hash,
    });

    await this.securityAuditService.create({
      user_id: user.id,
      company_id: user.company_id,
      event_type: security_event_type.USER_CREATED,
      entity_type: 'user',
      entity_id: user.id,
      detail: 'User registered',
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
    });

    return apiResponse.success('User registered', { user });
  }

  async me(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return apiResponse.success('User profile retrieved', { user });
  }

  async logout(userId: string, metadata: AuditRequestMetadata) {
    const user = await this.authRepository.findById(userId);

    await this.securityAuditService.create({
      ...(user ? { company_id: user.company_id } : {}),
      user_id: userId,
      event_type: security_event_type.LOGOUT,
      entity_type: 'user',
      entity_id: userId,
      detail: 'User logged out',
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
    });

    // Access tokens are stateless; the client removes its token after this response.
    return apiResponse.success('Logout successful');
  }
}

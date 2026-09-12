import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from '@module/auth/auth.controller';
import { JwtGuard } from '@module/auth/guards/jwt-guard';
import { AuthRepository } from '@module/auth/repository/auth.repository';
import PrismaAuthRepository from '@/module/auth/repository/prisma-auth.repository';
import { JwtStrategy } from '@module/auth/strategies/jwt.strategy';
import { SecurityAuditModule } from '@/module/security_audit/security-audit.module';
import type ms from 'ms';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as ms.StringValue;

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be configured before the API can start.');
}

@Module({
  imports: [
    SecurityAuditModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    JwtStrategy,
    {
      provide: AuthRepository,
      useClass: PrismaAuthRepository,
    },
  ],
  exports: [JwtGuard, JwtStrategy],
})
export class AuthModule {}

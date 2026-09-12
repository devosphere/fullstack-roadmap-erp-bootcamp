import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '@module/auth/auth.service';
import { loginSchema, LoginDto } from '@module/auth/dto/login.dto';
import { registerSchema, RegisterDto } from '@module/auth/dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from './guards/jwt-guard';
import type { JwtPayload } from './strategies/jwt.strategy';
import { ZodValidationPipe } from '@/src/common/pipes/zod-validation.pipe';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterDto,
    @Req() request: Request,
  ) {
    return this.authService.register(dto, {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
  }

  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginSchema)) dto: LoginDto,
    @Req() request: Request,
  ) {
    return this.authService.login(dto, {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user.sub);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@Req() request: AuthenticatedRequest) {
    return this.authService.logout(request.user.sub, {
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    });
  }
}

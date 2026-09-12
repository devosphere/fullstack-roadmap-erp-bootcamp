import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtService) {}

  async authenticate(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return this.validate(payload);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return payload;
  }
}

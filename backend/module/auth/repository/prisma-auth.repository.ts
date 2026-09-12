import { user } from '@/generated/prisma/client';
import { AuthRepository } from '@/module/auth/repository/auth.repository';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { LoginDto } from '@/module/auth/dto/login.dto';
import { RegisterDto } from '@/module/auth/dto/register.dto';
import { PrismaService } from '@/src/database/prisma/prisma.service';

@Injectable()
export default class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    return this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        company_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        last_login_at: true,
      },
    });
  }

  async register(dto: RegisterDto) {
    return this.prisma.user.create({
      data: dto,
      select: {
        id: true,
        company_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        last_login_at: true,
      },
    });
  }
}

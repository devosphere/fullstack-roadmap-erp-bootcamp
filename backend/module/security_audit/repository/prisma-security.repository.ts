import { Injectable } from '@nestjs/common';
import { SecurityAuditRepository } from './security.repository';
import { PrismaService } from '@/src/database/prisma/prisma.service';
import { CreateSecurityAuditDto } from '../dto/create-security_audit.dto';
import { type Prisma } from '@generated/prisma/client';

@Injectable()
export default class PrismaSecurityAuditRepository implements SecurityAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSecurityAuditDto) {
    return this.prisma.security_audit_log.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.security_audit_log.findMany();
  }

  async findOne(id: string) {
    return this.prisma.security_audit_log.findUnique({
      where: {
        id: id,
      },
    });
  }
}

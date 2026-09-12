import type { security_audit_log as PrismaSecurityAuditLog } from '@/generated/prisma/client';
import type { CreateSecurityAuditDto } from '../dto/create-security_audit.dto';

export abstract class SecurityAuditRepository {
  abstract create(dto: CreateSecurityAuditDto): Promise<PrismaSecurityAuditLog>;
  abstract findAll(): Promise<PrismaSecurityAuditLog[]>;
  abstract findOne(id: string): Promise<PrismaSecurityAuditLog | null>;

}

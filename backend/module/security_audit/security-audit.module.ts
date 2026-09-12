import { Module } from '@nestjs/common';
import { SecurityAuditService } from './security-audit.service';
import { SecurityAuditController } from '@/module/security_audit/security-audit.controller';
import { SecurityAuditRepository } from './repository/security.repository';
import PrismaSecurityAuditRepository from './repository/prisma-security.repository';

@Module({
  controllers: [SecurityAuditController],
  providers: [
    SecurityAuditService, 
    {
      provide: SecurityAuditRepository,
      useClass: PrismaSecurityAuditRepository,
    }
  ],
  exports: [SecurityAuditService]
})
export class SecurityAuditModule {}

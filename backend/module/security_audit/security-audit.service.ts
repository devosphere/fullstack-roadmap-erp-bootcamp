import { Injectable } from '@nestjs/common';
import { CreateSecurityAuditDto } from '@module/security_audit/dto/create-security_audit.dto';
import { UpdateSecurityAuditDto } from '@module/security_audit/dto/update-security_audit.dto';
import { SecurityAuditRepository } from './repository/security.repository';

@Injectable()
export class SecurityAuditService {
  constructor (private readonly service: SecurityAuditRepository) {}


  async create(dto: CreateSecurityAuditDto) {
    return this.service.create(dto);
  }

  async findAll() {
    return `This action returns all security Audit`;
  }

  async findOne(id: string) {
    return this.service.findOne(id);
  }

  async update(id: string, dto: UpdateSecurityAuditDto) {
    return `This action updates a #${id} security Audit`;
  }

  async remove(id: string) {
    return `This action removes a #${id} security Audit`;
  }
}

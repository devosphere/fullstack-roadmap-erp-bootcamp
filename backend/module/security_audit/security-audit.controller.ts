import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SecurityAuditService } from './security-audit.service';
import {
  createSecurityAuditSchema,
  type CreateSecurityAuditDto,
} from './dto/create-security_audit.dto';
import {
  updateSecurityAuditSchema,
  type UpdateSecurityAuditDto,
} from './dto/update-security_audit.dto';
import { ZodValidationPipe } from '@/src/common/pipes/zod-validation.pipe';
import { ApiTags } from '@nestjs/swagger';

@Controller('security-audit')
@ApiTags('Security Audit')
export class SecurityAuditController {
  constructor(private readonly securityAuditService: SecurityAuditService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createSecurityAuditSchema))
    dto: CreateSecurityAuditDto,
  ) {
    return this.securityAuditService.create(dto);
  }

  @Get()
  findAll() {
    return this.securityAuditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityAuditService.findOne(id);
  }

  @Patch(':id')
  Update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateSecurityAuditSchema))
    dto: UpdateSecurityAuditDto,
  ) {
    return this.securityAuditService.update(id, dto);
  }

  @Delete(':id')
  Remove(@Param('id') id: string) {
    return this.securityAuditService.remove(id);
  }
}

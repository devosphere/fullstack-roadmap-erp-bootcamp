import {
  createSecurityAuditSchema,
  type CreateSecurityAuditDto,
} from './create-security_audit.dto';

export const updateSecurityAuditSchema = createSecurityAuditSchema.partial();

export type UpdateSecurityAuditDto = Partial<CreateSecurityAuditDto>;

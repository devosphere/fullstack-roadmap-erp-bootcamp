import { security_event_type, type Prisma } from '@generated/prisma/client';
import { z } from 'zod';

const jsonObjectSchema = z
  .record(z.string(), z.unknown())
  .transform((value) => value as Prisma.InputJsonObject);

export const createSecurityAuditSchema = z.object({
  company_id: z.uuid().optional(),
  user_id: z.uuid().optional(),
  event_type: z.enum(security_event_type),
  entity_type: z.string().min(1).optional(),
  entity_id: z.string().min(1).optional(),
  old_value: jsonObjectSchema.optional(),
  new_value: jsonObjectSchema.optional(),
  detail: z.string().min(1).optional(),
  ip_address: z.string().min(1).optional(),
  user_agent: z.string().min(1).optional(),
});

export type CreateSecurityAuditDto = z.infer<typeof createSecurityAuditSchema>;

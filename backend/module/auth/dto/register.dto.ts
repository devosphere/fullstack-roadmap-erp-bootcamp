import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerSchema = z.object({
  company_id: z.uuid(),
  email: z.email(),
  password_hash: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});

export class RegisterDto extends createZodDto(registerSchema) {}
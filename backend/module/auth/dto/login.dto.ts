import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password_hash: z.string().min(6),
});

export class LoginDto extends createZodDto(loginSchema) {}

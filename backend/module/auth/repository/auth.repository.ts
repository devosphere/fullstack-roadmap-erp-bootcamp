import { type user as PrismaUser } from '@/generated/prisma/client';
import { LoginDto } from '@module/auth/dto/login.dto';
import { RegisterDto } from '@module/auth/dto/register.dto';

type AuthUser = Pick<
  PrismaUser,
  | 'id'
  | 'company_id'
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'status'
  | 'last_login_at'
>;

// type RegisteredUser = Omit<AuthUser, 'first_name'>; // If you want to delete something

export abstract class AuthRepository {
  abstract login(dto: LoginDto): Promise<PrismaUser | null>;
  abstract findByEmail(email: string): Promise<PrismaUser | null>;
  abstract findById(userId: string): Promise<AuthUser | null>;
  abstract register(dto: RegisterDto): Promise<AuthUser>;
}

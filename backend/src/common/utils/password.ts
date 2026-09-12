import bcrypt from 'bcrypt';

export function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verify(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

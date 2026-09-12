declare module 'bcrypt' {
  const bcrypt: {
    hash(password: string, saltRounds: number): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
  };

  export default bcrypt;
}

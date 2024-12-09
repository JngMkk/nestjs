import { compareSync, hashSync } from 'bcrypt';

export class PasswordHandler {
  static encrypt(password: string): string {
    return hashSync(password, 10);
  }

  static compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}

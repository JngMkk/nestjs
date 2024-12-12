import { pbkdf2Sync, randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  constructor(private readonly config: ConfigService) {}

  hashPassword(password: string): string {
    const pbkdf2Salt = randomBytes(16);
    const pwHash = this.pbkdf2Hash(Buffer.from(password), pbkdf2Salt);

    return `${pbkdf2Salt.toString('hex')}:${pwHash.toString('hex')}`;
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    const [pbkdf2SaltHex, pwHashHex] = hashedPassword.split(':');
    const pbkdf2Salt = Buffer.from(pbkdf2SaltHex, 'hex');
    const pwHash = this.pbkdf2Hash(Buffer.from(password), pbkdf2Salt);

    return pwHash.toString('hex') === pwHashHex;
  }

  validatePassword(password: string): boolean {
    return this.PASSWORD_REGEX.test(password);
  }

  private pbkdf2Hash(password: Buffer, salt: Buffer): Buffer {
    const iter = parseInt(this.config.get('PBKDF2_ITERATIONS'), 10);

    return pbkdf2Sync(
      password,
      salt,
      iter,
      32,
      this.config.get('PBKDF2_ALGORITHM'),
    );
  }
}

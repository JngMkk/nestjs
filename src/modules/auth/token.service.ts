import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { TokenPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 6;
  private readonly REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 3;

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(user: User): string {
    const payload = this.createPayload(user, this.ACCESS_TOKEN_EXPIRES_IN);

    return this.jwtService.sign(payload);
  }

  generateRefreshToken(user: User): string {
    const payload = this.createPayload(user, this.REFRESH_TOKEN_EXPIRES_IN);

    return this.jwtService.sign(payload);
  }

  private createPayload(user: User, expiresIn: number): TokenPayload {
    const iat = Math.floor(Date.now() / 1000);

    return {
      iat,
      aud: user.id,
      exp: iat + expiresIn,
      iss: this.config.get('JWT_ISSUER'),
    };
  }
}

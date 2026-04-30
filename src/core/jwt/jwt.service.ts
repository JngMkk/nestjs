import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ENV_TOKEN_SECRET_KEY } from '../config/consts/config.const';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  TOKEN_TYPE,
  TokenType,
} from './consts/jwt.const';
import { TokenPayload } from './interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * JWT 토큰 검증
   * @param token - 검증할 JWT 토큰
   * @returns 디코딩된 토큰 페이로드
   */
  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_TOKEN_SECRET_KEY),
    });
  }

  /**
   * 액세스 토큰 및 리프레시 토큰 발급
   * @param id - 사용자 ID
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  issueTokens(id: number): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.signToken(id, TOKEN_TYPE.ACCESS),
      refreshToken: this.signToken(id, TOKEN_TYPE.REFRESH),
    };
  }

  /**
   * JWT 서명
   * @param sub - 사용자 ID (subject)
   * @param type - 토큰 타입 (ACCESS | REFRESH)
   * @returns 서명된 JWT 토큰
   */
  private signToken(sub: number, type: TokenType): string {
    const expiresIn =
      type === TOKEN_TYPE.ACCESS
        ? ACCESS_TOKEN_EXPIRATION
        : REFRESH_TOKEN_EXPIRATION;

    return this.jwtService.sign(
      { sub, type },
      {
        secret: this.configService.get<string>(ENV_TOKEN_SECRET_KEY),
        expiresIn,
      },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from './consts/jwt.const';
import { TokenType } from './consts/jwt.enum';
import { TokenPayload } from './interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * JWT 토큰 검증
   * @param token - 검증할 JWT 토큰
   * @returns 디코딩된 토큰 페이로드
   */
  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET,
    });
  }

  /**
   * 액세스 토큰 및 리프레시 토큰 발급
   * @param id - 사용자 ID
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  issueTokens(id: number): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.signToken(id, TokenType.ACCESS),
      refreshToken: this.signToken(id, TokenType.REFRESH),
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
      type === TokenType.ACCESS
        ? ACCESS_TOKEN_EXPIRATION
        : REFRESH_TOKEN_EXPIRATION;

    return this.jwtService.sign(
      { sub, type },
      { secret: process.env.TOKEN_SECRET, expiresIn },
    );
  }
}

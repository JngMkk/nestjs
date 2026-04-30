import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenType } from 'src/core/jwt/consts/jwt.enum';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  protected validateTokenType(payload: TokenPayload): void {
    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenType } from 'src/core/jwt/consts/jwt.enum';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  protected validateTokenType(payload: TokenPayload): void {
    if (payload.type !== TokenType.ACCESS) {
      throw new UnauthorizedException('액세스 토큰이 아닙니다.');
    }
  }
}

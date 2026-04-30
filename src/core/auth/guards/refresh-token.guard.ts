import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKEN_TYPE } from 'src/core/jwt/consts/jwt.const';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { JwtService } from 'src/core/jwt/jwt.service';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  protected validateTokenType(payload: TokenPayload): void {
    if (payload.type !== TOKEN_TYPE.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }
  }
}

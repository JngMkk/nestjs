import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKEN_TYPE } from 'src/core/jwt/consts/jwt.const';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { JwtService } from 'src/core/jwt/jwt.service';
import { BearerTokenGuard } from './bearer-token.guard';

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  protected validateTokenType(payload: TokenPayload): void {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new UnauthorizedException('액세스 토큰이 아닙니다.');
    }
  }
}

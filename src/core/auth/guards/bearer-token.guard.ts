import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_HEADER } from 'src/core/auth/consts/auth-core.const';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { JwtService } from 'src/core/jwt/jwt.service';

/**
 * Bearer 헤더 형식 확인 및 JWT 검증 후 req.payload를 설정하는 추상 Guard.
 * 토큰 타입 검증은 하위 클래스에서 담당한다.
 */
export abstract class BearerTokenGuard implements CanActivate {
  constructor(protected readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers['authorization'];

    if (!raw) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');
    }

    const parts = raw.split(' ');
    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== TOKEN_HEADER.BEARER ||
      !parts[1]
    ) {
      throw new UnauthorizedException('유효하지 않은 Bearer 토큰 형식입니다.');
    }

    let payload: TokenPayload;
    try {
      payload = this.jwtService.verifyToken(parts[1]);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    this.validateTokenType(payload);
    (req as Request & { payload: TokenPayload }).payload = payload;

    return true;
  }

  protected abstract validateTokenType(payload: TokenPayload): void;
}

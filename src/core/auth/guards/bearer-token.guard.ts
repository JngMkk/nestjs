import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { JwtService } from 'src/core/jwt/jwt.service';
import { TokenHeader } from 'src/core/jwt/consts/jwt.enum';

/**
 * HTTP Bearer 헤더 형식을 확인하고 JWT를 검증한 뒤 payload를 req.user에 설정한다.
 */
@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers['authorization'];

    if (!raw) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');
    }

    const parts = raw.split(' ');
    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== TokenHeader.BEARER ||
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

    (req as Request & { payload: TokenPayload }).payload = payload;

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenHeader } from 'src/core/jwt/consts/jwt.enum';

/**
 * HTTP Basic 헤더 형식만 확인한다.
 * 실제 인증은 AuthService.signin()이 담당한다.
 */
@Injectable()
export class BasicTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers['authorization'];

    if (!raw) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다.');
    }

    const parts = raw.split(' ');
    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== TokenHeader.BASIC ||
      !parts[1]
    ) {
      throw new UnauthorizedException('유효하지 않은 Basic 토큰 형식입니다.');
    }

    (req as Request & { token: string }).token = parts[1];

    return true;
  }
}

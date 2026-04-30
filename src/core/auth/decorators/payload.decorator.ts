import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';

export const Payload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): TokenPayload => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (req as Request & { payload: TokenPayload }).payload;
  },
);

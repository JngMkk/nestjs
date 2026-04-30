import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const BasicToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (req as Request & { token: string }).token;
  },
);

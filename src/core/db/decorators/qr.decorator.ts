import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export const Qr = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): QueryRunner => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (!(req as Request & { queryRunner: QueryRunner }).queryRunner) {
      throw new InternalServerErrorException('QueryRunner is not found');
    }
    return (req as Request & { queryRunner: QueryRunner }).queryRunner;
  },
);

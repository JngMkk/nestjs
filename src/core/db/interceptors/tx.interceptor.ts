import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 생성
    const queryRunner = this.dataSource.createQueryRunner();

    // 쿼리 러너에 연결
    await queryRunner.connect();

    /**
     * 쿼리 러너에서 트랜잭션 시작
     * 이 시점부터 같은 쿼리 러너를 사용하면 트랜잭션 안에서 DB 액션을 실행할 수 있음
     */
    await queryRunner.startTransaction();

    req.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
      catchError(async (e: Error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw e;
      }),
    );
  }
}

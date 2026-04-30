import { Module } from '@nestjs/common';
import { TransactionInterceptor } from './interceptors/tx.interceptor';

@Module({
  providers: [TransactionInterceptor],
  exports: [TransactionInterceptor],
})
export class DatabaseModule {}

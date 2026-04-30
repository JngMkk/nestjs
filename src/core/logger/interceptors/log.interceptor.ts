import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();

    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;
    const method = req.method;

    this.logger.log(
      `**REQ** [${method}] ${path} ${now.toISOString()} ${req.ip}`,
    );

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const responseTime = new Date().getTime() - now.getTime();
        this.logger.log(
          `**RES** [${method}] ${path} ${now.toISOString()} ${req.ip} ${statusCode}(${responseTime}ms)`,
        );
      }),
    );
  }
}

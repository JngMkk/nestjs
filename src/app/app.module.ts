import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogInterceptor } from 'src/core/logger/interceptors/log.interceptor';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from '../core/config/consts/config.const';
import { AuthModule } from '../domain/auth/auth.module';
import { PostEntity } from '../domain/post/entities/post.entity';
import { PostModule } from '../domain/post/post.module';
import { UserEntity } from '../domain/user/entities/user.entity';
import { UserModule } from '../domain/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>(ENV_DB_HOST_KEY),
        port: config.get<number>(ENV_DB_PORT_KEY),
        username: config.get<string>(ENV_DB_USERNAME_KEY),
        password: config.get<string>(ENV_DB_PASSWORD_KEY),
        database: config.get<string>(ENV_DB_DATABASE_KEY),
        entities: [UserEntity, PostEntity],
        synchronize: true,
      }),
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  providers: [
    // 모든 응답에서 클래스 인스턴스를 직렬화
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    // 모든 요청과 응답에 대한 로깅
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },
  ],
})
export class AppModule {}

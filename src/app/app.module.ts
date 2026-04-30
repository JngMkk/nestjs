import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY] ?? '5432'),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [UserEntity, PostEntity],
      // production 환경에서는 false로 설정
      synchronize: true,
    }),
    UserModule,
    PostModule,
    AuthModule,
  ],
  providers: [
    // 모든 응답에서 클래스 인스턴스를 직렬화
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}

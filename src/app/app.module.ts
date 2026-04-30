import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
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

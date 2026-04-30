import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../domain/auth/auth.module';
import { PostEntity } from '../domain/posts/entities/posts.entity';
import { PostsModule } from '../domain/posts/posts.module';
import { UserEntity } from '../domain/users/entities/users.entity';
import { UsersModule } from '../domain/users/users.module';

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
    UsersModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}

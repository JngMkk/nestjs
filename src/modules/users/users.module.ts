import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 리포지토리를 모듈에 등록하지 않으면 서비스에서 리포지토리를 찾을 수 없음.
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 외부 모듈에서 사용하도록 설정
})
export class UsersModule {}

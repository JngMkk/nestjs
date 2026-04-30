import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // forfeature: module에서 사용할 entity를 등록
    TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCoreModule } from 'src/core/auth/auth-core.module';
import { PostEntity } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthCoreModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCoreModule } from 'src/core/auth/auth-core.module';
import { PostEntity } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), AuthCoreModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

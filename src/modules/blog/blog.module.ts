import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogFileRepository } from './blog.repository';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogFileRepository],
})
export class BlogModule {}

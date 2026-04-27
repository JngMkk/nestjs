import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './posts.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPost(): Post {
    return this.postsService.getPost();
  }
}

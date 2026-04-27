import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModel } from './posts.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return this.postsService.getPosts();
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    return this.postsService.createPost(author, title, content);
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    return this.postsService.getPostById(+id);
  }

  @Put(':id')
  updateOrCreatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('likeCount') likeCount: string,
    @Body('commentCount') commentCount: string,
  ): PostModel {
    return this.postsService.updateOrCreatePost(
      +id,
      author,
      title,
      content,
      +likeCount,
      +commentCount,
    );
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
    @Body('likeCount') likeCount?: string,
    @Body('commentCount') commentCount?: string,
  ): PostModel {
    return this.postsService.updatePost(
      +id,
      author,
      title,
      content,
      likeCount ? +likeCount : undefined,
      commentCount ? +commentCount : undefined,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  deletePost(@Param('id') id: string): void {
    return this.postsService.deletePost(+id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { BlogService } from './blog.service';
import { PostDto } from './dtos/post.dto';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  async listPosts(): Promise<PostDto[]> {
    console.log('모든 게시글 가져오기');

    return await this.blogService.listPosts();
  }

  @Post()
  async createPost(@Body() postDto: PostDto): Promise<void> {
    console.log('게시글 작성');
    console.log(postDto);

    return await this.blogService.createPost(postDto);
  }

  @Get('/:id')
  async getPost(@Param('id') id: number): Promise<PostDto> {
    console.log(`[id: ${id}] 게시글 가져오기`);

    return await this.blogService.getPost(id);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: number): Promise<void> {
    console.log(`[id: ${id}] 게시글 삭제`);

    return await this.blogService.delete(id);
  }

  @Put('/:id')
  async updatePost(
    @Param('id') id: number,
    @Body() postDto: PostDto,
  ): Promise<PostDto> {
    console.log(`[id: ${id}] 게시글 수정`);
    console.log(postDto);

    return await this.blogService.updatePost(id, postDto);
  }
}

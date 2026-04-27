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
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/patch-post.dto';
import { UpdateOrCreatePostDto } from './dtos/put-post.dto';
import { PostEntity } from './entities/posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * [GET] /posts 모든 게시글을 조회한다.
   * @returns 게시글 목록
   */
  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  /**
   * [POST] /posts 게시글을 생성한다.
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @returns 생성된 게시글
   */
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  /**
   * [GET] /posts/:id 특정 게시글을 조회한다.
   * @param id
   * @returns 게시글
   */
  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPostById(id);
  }

  /**
   * [PUT] /posts/:id 특정 게시글을 수정 또는 생성한다.
   * @param id 게시글 ID
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param likeCount 게시글 좋아요 수
   * @param commentCount 게시글 댓글 수
   * @returns 수정 또는 생성된 게시글
   */
  @Put(':id')
  updateOrCreatePost(
    @Param('id') id: string,
    @Body() updateOrCreatePostDto: UpdateOrCreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updateOrCreatePost(id, updateOrCreatePostDto);
  }

  /**
   * [PATCH] /posts/:id 특정 게시글을 수정한다.
   * @param id 게시글 ID
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param likeCount 게시글 좋아요 수
   * @param commentCount 게시글 댓글 수
   * @returns 수정된 게시글
   */
  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto);
  }

  /**
   * [DELETE] /posts/:id 특정 게시글을 삭제한다.
   * @param id
   * @returns 삭제된 게시글
   */
  @Delete(':id')
  @HttpCode(204)
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { API_AUTH_TYPE } from 'src/common/consts/swagger.const';
import { Payload } from 'src/core/auth/decorators/payload.decorator';
import { AccessTokenGuard } from 'src/core/auth/guards/access-token.guard';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UpsertPostDto } from './dtos/upsert-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * [GET] /posts 모든 게시글을 조회한다.
   * @returns 게시글 목록
   */
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postService.getPosts();
  }

  /**
   * [POST] /posts 게시글을 생성한다.
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @returns 생성된 게시글
   */
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @HttpCode(201)
  @Post()
  createPost(
    @Payload() payload: TokenPayload,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postService.createPost(payload.sub, createPostDto);
  }

  /**
   * [GET] /posts/:id 특정 게시글을 조회한다.
   * @param id
   * @returns 게시글
   */
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.getPostById(id);
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
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  updateOrCreatePost(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: TokenPayload,
    @Body() upsertPostDto: UpsertPostDto,
  ): Promise<PostEntity> {
    return this.postService.updateOrCreatePost(
      id,
      payload.sub,
      upsertPostDto,
    );
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
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: TokenPayload,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.updatePost(id, payload.sub, updatePostDto);
  }

  /**
   * [DELETE] /posts/:id 특정 게시글을 삭제한다.
   * @param id
   * @returns 삭제된 게시글
   */
  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Payload() payload: TokenPayload,
  ): Promise<void> {
    return this.postService.deletePost(id, payload.sub);
  }
}

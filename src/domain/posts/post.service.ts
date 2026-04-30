import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/patch-post.dto';
import { UpdateOrCreatePostDto } from './dtos/put-post.dto';
import { PostEntity } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    // repository를 사용하기 위해서는 InjectRepository 데코레이터를 사용해야 함
    // model을 기반으로 repository를 생성
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getPosts(): Promise<PostEntity[]> {
    return await this.postRepository.find({
      relations: ['author'],
    });
  }

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    // 1) create
    const post = this.postRepository.create({
      author: { id: userId },
      title: createPostDto.title,
      content: createPostDto.content,
    });

    // 2) save
    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.findPostById(id);
    if (!post) {
      // 기본 제공 Exception
      // https://docs.nestjs.com/exception-filters
      throw new NotFoundException(`게시글 ${+id}을 찾을 수 없습니다.`);
    }
    return post;
  }

  async updateOrCreatePost(
    id: number,
    userId: number,
    updateOrCreatePostDto: UpdateOrCreatePostDto,
  ): Promise<PostEntity> {
    const existingPost = await this.findPostById(id);
    if (!existingPost) {
      return await this.createPost(userId, updateOrCreatePostDto);
    }

    if (existingPost.author.id !== userId) {
      throw new ForbiddenException('게시글 수정 권한이 없습니다.');
    }

    existingPost.title = updateOrCreatePostDto.title;
    existingPost.content = updateOrCreatePostDto.content;
    existingPost.likeCount =
      updateOrCreatePostDto.likeCount ?? existingPost.likeCount;
    existingPost.commentCount =
      updateOrCreatePostDto.commentCount ?? existingPost.commentCount;

    return await this.postRepository.save(existingPost);
  }

  async updatePost(
    id: number,
    userId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const existingPost = await this.getPostById(id);
    if (existingPost.author.id !== userId) {
      throw new ForbiddenException('게시글 수정 권한이 없습니다.');
    }

    existingPost.title = updatePostDto.title ?? existingPost.title;
    existingPost.content = updatePostDto.content ?? existingPost.content;
    existingPost.likeCount = updatePostDto.likeCount ?? existingPost.likeCount;
    existingPost.commentCount =
      updatePostDto.commentCount ?? existingPost.commentCount;

    return await this.postRepository.save(existingPost);
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const existingPost = await this.findPostById(id);
    if (!existingPost) {
      return;
    }

    if (existingPost.author.id !== userId) {
      throw new ForbiddenException('게시글 삭제 권한이 없습니다.');
    }

    await this.postRepository.delete(id);
  }

  private async findPostById(id: number): Promise<PostEntity | null> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }
}

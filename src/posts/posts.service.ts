import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    // 1) create
    const post = this.postRepository.create({
      author: { id: createPostDto.authorId },
      title: createPostDto.title,
      content: createPostDto.content,
    });

    // 2) save
    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async getPostById(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id: +id },
      relations: ['author'],
    });
    if (!post) {
      // 기본 제공 Exception
      // https://docs.nestjs.com/exception-filters
      throw new NotFoundException(`게시글 ${+id}을 찾을 수 없습니다.`);
    }
    return post;
  }

  async updateOrCreatePost(
    id: string,
    updateOrCreatePostDto: UpdateOrCreatePostDto,
  ): Promise<PostEntity> {
    const existingPost = await this.postRepository.findOne({
      where: { id: +id },
    });
    if (!existingPost) {
      return await this.createPost(updateOrCreatePostDto);
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
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const existingPost = await this.getPostById(id);

    existingPost.title = updatePostDto.title ?? existingPost.title;
    existingPost.content = updatePostDto.content ?? existingPost.content;
    existingPost.likeCount = updatePostDto.likeCount ?? existingPost.likeCount;
    existingPost.commentCount =
      updatePostDto.commentCount ?? existingPost.commentCount;

    return await this.postRepository.save(existingPost);
  }

  async deletePost(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}

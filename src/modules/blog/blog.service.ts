import { Injectable } from '@nestjs/common';
import { PostDto } from './dtos/post.dto';
import { BlogFileRepository } from './blog.repository';

@Injectable()
export class BlogService {
  // 클래스의 생성자에 매개변수로 설정된 타입이 프로바이더로 설정된 타입 중 하나라면, NestJS는 자동으로 필요한 객체를 주입해줌.
  // BlogRepository는 인터페이스이므로 클래스를 생성할 수 없음. 따라서 의존성 주입을 할 수 없음.
  constructor(private blogRepository: BlogFileRepository) {}

  async listPosts(): Promise<PostDto[]> {
    return await this.blogRepository.listPosts();
  }

  async createPost(postDto: PostDto): Promise<void> {
    return await this.blogRepository.createPost(postDto);
  }

  async getPost(id: number): Promise<PostDto> {
    return await this.blogRepository.getPost(id);
  }

  async delete(id: number): Promise<void> {
    return await this.blogRepository.delete(id);
  }

  async updatePost(id: number, postDto: PostDto): Promise<PostDto> {
    return await this.blogRepository.updatePost(id, postDto);
  }
}

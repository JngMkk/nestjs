import { writeFile } from 'fs';
import { readFile } from 'fs/promises';

import { Injectable } from '@nestjs/common';

import { PostDto } from './dtos/post.dto';

export interface BlogRepository {
  listPosts(): Promise<PostDto[]>;
  createPost(postDto: PostDto): Promise<void>;
  getPost(id: number): Promise<PostDto>;
  delete(id: number): Promise<void>;
  updatePost(id: number, postDto: PostDto): Promise<PostDto>;
}

@Injectable()
export class BlogFileRepository implements BlogRepository {
  FILE_NAME = './src/modules/blog/blog.data.json';

  async listPosts(): Promise<PostDto[]> {
    const datas = await readFile(this.FILE_NAME, { encoding: 'utf-8' });
    const posts = JSON.parse(datas);

    return posts;
  }

  async createPost(postDto: PostDto): Promise<void> {
    const posts = await this.listPosts();

    const id = posts.length + 1;
    const post = { id, ...postDto, createdAt: new Date() };
    posts.push(post);

    await writeFile(this.FILE_NAME, JSON.stringify(posts), () => {});
  }

  async getPost(id: number): Promise<PostDto> {
    const posts = await this.listPosts();
    const result = posts.find((post) => post.id === id);

    return result;
  }

  async delete(id: number): Promise<void> {
    const posts = await this.listPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);

    await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts), () => {});
  }

  async updatePost(id: number, postDto: PostDto): Promise<PostDto> {
    const posts = await this.listPosts();

    const idx = posts.findIndex((post) => post.id === id);
    const post = { id, ...postDto, updatedAt: new Date() };
    posts[idx] = post;

    await writeFile(this.FILE_NAME, JSON.stringify(posts), () => {});

    return post;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './posts.interface';

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 1003012,
    commentCount: 8914,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습 하고 있는 해린',
    likeCount: 505220,
    commentCount: 1221,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 지수',
    content: '연기 연습 하고 있는 지수',
    likeCount: 203831009,
    commentCount: 1383100,
  },
];

@Injectable()
export class PostsService {
  getPosts(): PostModel[] {
    return posts;
  }

  createPost(author: string, title: string, content: string): PostModel {
    const newPost = {
      id: posts.length + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(newPost);
    return newPost;
  }

  getPostById(id: number): PostModel {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      // 기본 제공 Exception
      // https://docs.nestjs.com/exception-filters
      throw new NotFoundException(`게시글 ${id}을 찾을 수 없습니다.`);
    }
    return post;
  }

  updateOrCreatePost(
    id: number,
    author: string,
    title: string,
    content: string,
    likeCount: number,
    commentCount: number,
  ): PostModel {
    const existingPost = posts.find((post) => post.id === id);
    if (existingPost) {
      existingPost.author = author;
      existingPost.title = title;
      existingPost.content = content;
      existingPost.likeCount = likeCount;
      existingPost.commentCount = commentCount;

      posts = posts.map((post) => (post.id === id ? existingPost : post));
      return existingPost;
    }
    return this.createPost(author, title, content);
  }

  updatePost(
    id: number,
    author?: string,
    title?: string,
    content?: string,
    likeCount?: number,
    commentCount?: number,
  ): PostModel {
    const existingPost = posts.find((post) => post.id === id);
    if (!existingPost) {
      throw new NotFoundException(`게시글 ${id}을 찾을 수 없습니다.`);
    }

    existingPost.author = author || existingPost.author;
    existingPost.title = title || existingPost.title;
    existingPost.content = content || existingPost.content;
    existingPost.likeCount = likeCount || existingPost.likeCount;
    existingPost.commentCount = commentCount || existingPost.commentCount;

    posts = posts.map((post) => (post.id === id ? existingPost : post));
    return existingPost;
  }

  deletePost(id: number): void {
    posts = posts.filter((post) => post.id !== id);
  }
}

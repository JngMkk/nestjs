import { NotFoundException } from '@nestjs/common';
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

export class PostsService {
  /**
   * [GET] /posts 모든 게시글을 조회한다.
   * @returns 게시글 목록
   */
  getPosts(): PostModel[] {
    return posts;
  }

  /**
   * [POST] /posts 게시글을 생성한다.
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @returns 생성된 게시글
   */
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

  /**
   * [GET] /posts/:id 특정 게시글을 조회한다.
   * @param id
   * @returns 게시글
   */
  getPostById(id: number): PostModel {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      // 기본 제공 Exception
      // https://docs.nestjs.com/exception-filters
      throw new NotFoundException(`게시글 ${id}을 찾을 수 없습니다.`);
    }
    return post;
  }

  /**
   * [PUT] /posts/:id 특정 게시글을 수정한다.
   * @param id 게시글 ID
   * @param author 게시글 작성자
   * @param title 게시글 제목
   * @param content 게시글 내용
   * @param likeCount 게시글 좋아요 수
   * @param commentCount 게시글 댓글 수
   * @returns 수정된 게시글
   */
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

  /**
   * [DELETE] /posts/:id 특정 게시글을 삭제한다.
   * @param id
   * @returns 삭제된 게시글
   */
  deletePost(id: number): void {
    posts = posts.filter((post) => post.id !== id);
  }
}

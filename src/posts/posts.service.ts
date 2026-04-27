import { Injectable } from '@nestjs/common';
import { Post } from './posts.interface';

@Injectable()
export class PostsService {
  getPost(): Post {
    return {
      author: 'newjeans_official',
      title: '뉴진스 민지',
      content: '메이크업 고치고 있는 민지',
      likeCount: 1000000,
      commentCount: 7999,
    };
  }
}

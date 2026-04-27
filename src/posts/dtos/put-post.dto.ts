export class UpdateOrCreatePostDto {
  author: string;
  title: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
}

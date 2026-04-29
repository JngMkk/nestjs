export class UpdateOrCreatePostDto {
  authorId: number;
  title: string;
  content: string;
  likeCount?: number;
  commentCount?: number;
}

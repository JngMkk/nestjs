export interface PostDto {
  id: number;
  title: string;
  content: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

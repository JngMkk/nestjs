import { PartialType, PickType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(
  PickType(PostEntity, ['title', 'content', 'likeCount', 'commentCount']),
) {}

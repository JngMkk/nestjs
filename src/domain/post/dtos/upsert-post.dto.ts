import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class UpsertPostDto extends IntersectionType(
  PickType(PostEntity, ['title', 'content']),
  PartialType(PickType(PostEntity, ['likeCount', 'commentCount'])),
) {}

import { BaseEntity } from 'src/common/entities/base.entity';
import { UserEntity } from 'src/domain/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;
}

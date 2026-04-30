import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { stringValidationMessage } from 'src/common/utils/validation-message.util';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @IsNotEmpty()
  @IsString({ message: stringValidationMessage })
  @Column()
  title: string;

  @IsNotEmpty()
  @IsString({ message: stringValidationMessage })
  @Column()
  content: string;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;
}

import { BaseEntity } from 'src/common/entities/base.entity';
import { PostEntity } from 'src/domain/posts/entities/posts.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleEnum } from '../consts/role.enum';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true, length: 20 })
  nickname: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 64 })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToMany(() => PostEntity, (post) => post.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];
}

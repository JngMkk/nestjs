import { PostEntity } from 'src/posts/entities/posts.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../consts/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  nickname: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false, length: 64 })
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

import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import {
  lengthValidationMessage,
  maxLengthValidationMessage,
  stringValidationMessage,
} from 'src/common/utils/validation-message.util';
import { PostEntity } from 'src/domain/post/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleEnum } from '../enums/role.enum';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @IsNotEmpty()
  @Length(2, 20, { message: lengthValidationMessage })
  @IsString()
  @Column({ unique: true, length: 20 })
  nickname: string;

  @IsNotEmpty()
  @MaxLength(255, { message: maxLengthValidationMessage })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  @Column({ unique: true, length: 255 })
  email: string;

  @IsNotEmpty()
  @Length(8, 20, { message: lengthValidationMessage })
  @IsString({ message: stringValidationMessage })
  @Exclude({ toPlainOnly: true })
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

  // @Expose()
  // get nicknameAndEmail(): string {
  //   return `${this.nickname} <${this.email}>`;
  // }
}

import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/domain/user/entities/user.entity';

export class SignupDto extends PickType(UserEntity, [
  'nickname',
  'email',
  'password',
]) {}

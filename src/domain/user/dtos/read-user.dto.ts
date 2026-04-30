import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class ReadUserDto extends PickType(UserEntity, [
  'id',
  'nickname',
  'email',
]) {}

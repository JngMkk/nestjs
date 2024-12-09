import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  password2: string;
}

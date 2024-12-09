import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}

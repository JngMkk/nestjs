import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos/bodies.dto';
import { ReadTokenDto } from './dtos/responses.dto';
import { ReadUserDto } from '../users/dtos/responses.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  convertToReadUserDto(user: User): ReadUserDto {
    return plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  convertToReadTokenDto(tokens: {
    accessToken: string;
    refreshToken: string;
  }): ReadTokenDto {
    return plainToInstance(ReadTokenDto, tokens, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/signup')
  async signUp(@Body() body: SignUpDto): Promise<ReadUserDto> {
    const user = await this.authService.signUp(body);
    return this.convertToReadUserDto(user);
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() body: SignInDto): Promise<ReadTokenDto> {
    const tokens = await this.authService.signIn(body);
    return this.convertToReadTokenDto(tokens);
  }
}

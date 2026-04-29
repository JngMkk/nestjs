import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReadTokenDto } from './dtos/read-token.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignupDto): Promise<ReadTokenDto> {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Headers('Authorization') raw: string): Promise<ReadTokenDto> {
    return this.authService.signin(raw);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ReadTokenDto } from './dtos/read-token.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignupDto): Promise<ReadTokenDto> {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto): Promise<ReadTokenDto> {
    return this.authService.signin(signinDto);
  }
}

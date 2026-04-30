import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { API_AUTH_TYPE } from 'src/common/consts/swagger.const';
import { BasicToken } from 'src/core/auth/decorators/basic-token.decorator';
import { Payload } from 'src/core/auth/decorators/payload.decorator';
import { BasicTokenGuard } from 'src/core/auth/guards/basic-token.guard';
import { RefreshTokenGuard } from 'src/core/auth/guards/refresh-token.guard';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
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

  @ApiBasicAuth(API_AUTH_TYPE.BASIC)
  @UseGuards(BasicTokenGuard)
  @HttpCode(200)
  @Post('signin')
  signin(@BasicToken() token: string): Promise<ReadTokenDto> {
    return this.authService.signin(token);
  }

  @ApiBearerAuth(API_AUTH_TYPE.REFRESH)
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Post('refresh')
  refresh(@Payload() payload: TokenPayload): ReadTokenDto {
    return this.authService.rotateToken(payload);
  }
}

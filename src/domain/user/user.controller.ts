import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { API_AUTH_TYPE } from 'src/common/consts/swagger.const';
import { Payload } from 'src/core/auth/decorators/payload.decorator';
import { AccessTokenGuard } from 'src/core/auth/guards/access-token.guard';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { ReadUserDto } from './dtos/read-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  getMe(@Payload() payload: TokenPayload): Promise<ReadUserDto> {
    return this.userService.getMe(payload.sub);
  }
}

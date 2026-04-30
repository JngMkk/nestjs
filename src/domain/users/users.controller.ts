import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { API_AUTH_TYPE } from 'src/common/consts/swagger.const';
import { Payload } from 'src/core/auth/decorators/payload.decorator';
import { AccessTokenGuard } from 'src/core/auth/guards/access-token.guard';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth(API_AUTH_TYPE.ACCESS)
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  getMe(@Payload() payload: TokenPayload): Promise<UserEntity> {
    return this.usersService.getMe(payload.sub);
  }
}

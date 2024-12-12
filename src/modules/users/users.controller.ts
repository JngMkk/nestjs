import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminUser } from 'src/common/decorators/authorization.decorator';

import { ReadUserDto } from './dtos/responses.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  convertToReadUserDto(user: User): ReadUserDto {
    return plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@AdminUser() user: User): Promise<ReadUserDto> {
    return this.convertToReadUserDto(user);
  }

  @Delete('/me')
  async deleteUser(@AdminUser() user: User): Promise<void> {
    await this.userService.deleteUser(user.id);
  }
}

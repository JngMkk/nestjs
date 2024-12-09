import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos/bodies.dto';
import { ReadUserDto } from './dtos/responses.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  convertToReadUserDto(user: User): ReadUserDto {
    return plainToInstance(ReadUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.userService.createUser(body);
    return this.convertToReadUserDto(user);
  }

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    const user = await this.userService.getUser(id);
    return this.convertToReadUserDto(user);
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.userService.updateUser(id, body);
    return this.convertToReadUserDto(user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = parseInt(id, 10);
    await this.userService.deleteUser(objectId);
  }
}

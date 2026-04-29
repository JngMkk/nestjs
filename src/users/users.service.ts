import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      nickname: createUserDto.nickname,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return await this.userRepository.save(user);
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
}

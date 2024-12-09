import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordHandler } from 'src/core/security/auth/password';
import { DeleteResult, Repository } from 'typeorm';

import { UpdateUserDto } from './dtos/bodies.dto';
import { User } from './entities/user.entity';
import { SignUpDto } from '../auth/dtos/bodies.dto';

@Injectable()
export class UserService {
  constructor(
    // 리포지토리 주입
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(body: SignUpDto): Promise<User> {
    return await this.userRepository.save(body);
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async updateUser(id: number, body: UpdateUserDto): Promise<User> {
    const user = await this.getUser(id);

    user.password = PasswordHandler.encrypt(body.password);

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: id });
  }
}

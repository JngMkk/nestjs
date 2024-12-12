import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

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

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: id });
  }
}

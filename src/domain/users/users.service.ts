import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    user: Pick<UserEntity, 'nickname' | 'email' | 'password'>,
  ): Promise<UserEntity> {
    const nicknameExists = await this.userRepository.exists({
      where: { nickname: user.nickname },
    });
    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const emailExists = await this.userRepository.exists({
      where: { email: user.email },
    });
    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}

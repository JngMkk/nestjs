import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
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

  async getMe(userId: number): Promise<UserEntity> {
    const user = await this.findUserByCondition({ id: userId });
    if (!user) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return user;
  }

  async findUserByCondition(
    condition: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: condition });
  }
}

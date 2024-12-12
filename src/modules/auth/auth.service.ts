import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/users.service';
import { SignInDto, SignUpDto } from './dtos/bodies.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async signUp(body: SignUpDto): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    if (user !== null) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPwd = this.passwordService.hashPassword(body.password);

    try {
      return await this.userService.createUser({
        ...body,
        password: hashedPwd,
      });
    } catch {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(body: SignInDto) {
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException('User not Found');
    }

    if (!this.passwordService.verifyPassword(body.password, user.password)) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CookiePayload } from 'src/core/security/auth/cookie';
import { PasswordHandler } from 'src/core/security/auth/password';

import { User } from '../users/entities/user.entity';
import { UserService } from '../users/users.service';
import { SignInDto, SignUpDto } from './dtos/bodies.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(body: SignUpDto): Promise<User> {
    const user = await this.userService.getUserByEmail(body.email);
    if (user !== null) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const encryptedPwd = PasswordHandler.encrypt(body.password);

    try {
      return await this.userService.createUser({
        ...body,
        password: encryptedPwd,
      });
    } catch {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(
    body: SignInDto,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const user = await this.validateSignIn(body.email, body.password);

    return this.setCookie(user, res);
  }

  private async setCookie(
    user: User,
    res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const cookiePayload = new CookiePayload(user.id, user.email);

    res.cookie('__AUT', cookiePayload.toString(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });

    return res.send({ message: 'Logged in successfully' });
  }

  private async validateSignIn(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = PasswordHandler.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}

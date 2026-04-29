import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import {
  ACCESS_TOKEN_EXPIRATION,
  HASH_ROUNDS,
  REFRESH_TOKEN_EXPIRATION,
} from './consts/auth.const';
import { TokenType } from './consts/auth.enum';
import { ReadTokenDto } from './dtos/read-token.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 로그인
   * @param user - 사용자 정보
   * @returns - 토큰 정보
   */
  async signin(signinDto: SigninDto): Promise<ReadTokenDto> {
    const foundUser = await this.authenticate(
      signinDto.email,
      signinDto.password,
    );

    return this.issueTokens(foundUser.id);
  }

  /**
   * 회원가입
   * @param signUpDto - 회원가입 정보
   * @returns - 토큰 정보
   */
  async signup(signUpDto: SignupDto): Promise<ReadTokenDto> {
    const hashedPassword = bcrypt.hashSync(signUpDto.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    return this.issueTokens(newUser.id);
  }

  /**
   * 토큰 서명
   * - sub: 사용자 ID
   * - type: 토큰 타입 (TokenType)
   * @param sub - 사용자 ID (sub)
   * @param type - 토큰 타입 (TokenType)
   * @returns - 토큰
   */
  private signToken(sub: number, type: TokenType): string {
    const payload = { sub, type };

    const expiresIn =
      type === TokenType.ACCESS
        ? ACCESS_TOKEN_EXPIRATION
        : REFRESH_TOKEN_EXPIRATION;

    return this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn,
    });
  }

  /**
   * 토큰 발급
   * @param id - 사용자 ID
   * @returns - 토큰 정보
   */
  private issueTokens(id: number): ReadTokenDto {
    return {
      accessToken: this.signToken(id, TokenType.ACCESS),
      refreshToken: this.signToken(id, TokenType.REFRESH),
    };
  }

  /**
   * 이메일과 비밀번호를 검증
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   * @returns - 사용자 정보
   */
  private async authenticate(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const foundUser = await this.usersService.getUserByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return foundUser;
  }
}

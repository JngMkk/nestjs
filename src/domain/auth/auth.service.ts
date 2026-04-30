import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { decodeBase64 } from 'src/common/utils/base64.util';
import { TokenType } from 'src/core/jwt/consts/jwt.enum';
import { TokenPayload } from 'src/core/jwt/interfaces/jwt.interface';
import { JwtService } from 'src/core/jwt/jwt.service';
import { UserEntity } from 'src/domain/users/entities/users.entity';
import { UsersService } from 'src/domain/users/users.service';
import { HASH_ROUNDS } from './consts/auth.const';
import { ReadTokenDto } from './dtos/read-token.dto';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 로그인
   * @param token - Basic 토큰 (base64(email:password))
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  async signin(token: string): Promise<ReadTokenDto> {
    const user = await this.verifyBasicCredentials(token);
    return this.jwtService.issueTokens(user.id);
  }

  /**
   * 회원가입
   * @param signUpDto - 회원가입 정보
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  async signup(signUpDto: SignupDto): Promise<ReadTokenDto> {
    const hashedPassword = bcrypt.hashSync(signUpDto.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    return this.jwtService.issueTokens(newUser.id);
  }

  /**
   * 토큰 갱신
   * @param payload - BearerTokenGuard가 검증한 토큰 페이로드
   * @returns 새로운 액세스 토큰 및 리프레시 토큰
   */
  rotateToken(payload: TokenPayload): ReadTokenDto {
    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }

    return this.jwtService.issueTokens(payload.sub);
  }

  /**
   * Basic 자격증명을 검증하고 사용자를 반환한다.
   * @param token - Basic 토큰 (base64(email:password))
   * @returns 인증된 사용자 엔티티
   */
  private async verifyBasicCredentials(token: string): Promise<UserEntity> {
    const decoded = decodeBase64(token);
    const parts = decoded.split(':');

    // email:password 형식 검증
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const [email, password] = parts;
    return this.authenticate(email, password);
  }

  /**
   * 이메일과 비밀번호로 사용자 인증
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호 (평문)
   * @returns 인증된 사용자 엔티티
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

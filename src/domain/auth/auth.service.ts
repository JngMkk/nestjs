import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/core/jwt/jwt.service';
import { TokenHeader, TokenType } from 'src/core/jwt/consts/jwt.enum';
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
   * @param raw - Authorization 헤더 값 (Basic base64(email:password))
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  async signin(raw: string): Promise<ReadTokenDto> {
    const base64Token = this.extractTokenFromHeader(raw, TokenHeader.BASIC);
    const { email, password } = this.decodeBasicToken(base64Token);
    const foundUser = await this.authenticate(email, password);

    return this.jwtService.issueTokens(foundUser.id);
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
   * @param token - Authorization 헤더 값 (Bearer 리프레시 토큰)
   * @returns 새로운 액세스 토큰 및 리프레시 토큰
   */
  rotateToken(token: string): ReadTokenDto {
    const refreshToken = this.extractTokenFromHeader(token, TokenHeader.BEARER);

    let payload: { sub: number; type: TokenType };
    try {
      payload = this.jwtService.verifyToken(refreshToken);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    if (payload.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return this.jwtService.issueTokens(payload.sub);
  }

  /**
   * Authorization 헤더에서 토큰 추출
   * @param header - Authorization 헤더 값
   * @param expectedType - 기대하는 토큰 타입 (Basic | Bearer)
   * @returns 추출된 토큰 문자열
   */
  private extractTokenFromHeader(header: string, expectedType: TokenHeader): string {
    const splitted = header.split(' ');
    if (splitted.length !== 2) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const [type, token] = splitted;
    if (type.toLowerCase() !== expectedType) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return token;
  }

  /**
   * Basic 토큰 디코딩
   * @param base64Token - Base64 인코딩된 토큰 (email:password)
   * @returns 이메일과 비밀번호
   */
  private decodeBasicToken(base64Token: string): { email: string; password: string } {
    const decoded = Buffer.from(base64Token, 'base64').toString('utf-8');
    const splitted = decoded.split(':');
    if (splitted.length !== 2) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const [email, password] = splitted;
    if (!email || !password) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return { email, password };
  }

  /**
   * 이메일과 비밀번호로 사용자 인증
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호 (평문)
   * @returns 인증된 사용자 엔티티
   */
  private async authenticate(email: string, password: string): Promise<UserEntity> {
    const foundUser = await this.usersService.getUserByEmail(email);
    if (!foundUser) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    return foundUser;
  }
}

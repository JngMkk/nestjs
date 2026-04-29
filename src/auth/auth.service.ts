import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities/users.entity';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from './consts/token.const';
import { TokenType } from './consts/token.enum';

@Injectable()
export class AuthService {
  /**
   * 1) registerWithEmail: 이메일 회원가입
   *    - email, nickname, password를 받아서 회원가입
   *    - 생성이 완료되면 access token & refresh token 발급
   *
   * 2) loginWithEmail: 이메일 로그인
   *    - email, password를 입력하면 사용자 검증을 진행
   *    - 검증이 완료되면 access token & refresh token 발급
   *
   * 3) issueTokens: 토큰 발급 (1, 2)
   *
   * 4) signToken: 토큰 서명 (3)
   *
   * 5) authenticateWithEmailAndPassword: 이메일과 비밀번호를 검증
   *    - 사용자 존재하는지 확인
   *    - 비밀번호 맞는지 확인
   *    - 모두 통과되면 찾은 사용자 정보 반환
   *    - 토큰 생성
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 토큰 서명
   * - sub: 사용자 ID
   * - type: 토큰 타입 (TokenType)
   * @param userId - 사용자 ID (sub)
   * @param type - 토큰 타입 (TokenType)
   * @returns - 토큰
   */
  signToken(user: Pick<UserEntity, 'id'>, type: TokenType): string {
    const payload = {
      sub: user.id,
      type,
    };

    const expiresIn =
      type === TokenType.ACCESS
        ? ACCESS_TOKEN_EXPIRATION
        : REFRESH_TOKEN_EXPIRATION;

    return this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn,
    });
  }
}

import { TokenType } from '../consts/jwt.const';

export interface TokenPayload {
  sub: number;
  type: TokenType;
}

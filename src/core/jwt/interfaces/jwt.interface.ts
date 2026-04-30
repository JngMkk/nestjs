import { TokenType } from '../consts/jwt.enum';

export interface TokenPayload {
  sub: number;
  type: TokenType;
}

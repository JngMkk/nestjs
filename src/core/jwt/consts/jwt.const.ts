export const ACCESS_TOKEN_EXPIRATION = 5 * 60; // 5분
export const REFRESH_TOKEN_EXPIRATION = 1 * 24 * 60 * 60; // 1일

export const TOKEN_TYPE = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
} as const;

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

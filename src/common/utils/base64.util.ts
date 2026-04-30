/**
 * Base64 문자열을 디코딩한다.
 * @param base64 - Base64 인코딩된 문자열
 * @param encoding - 출력 인코딩 (기본값: 'utf-8')
 * @returns 디코딩된 문자열
 */
export function decodeBase64(
  base64: string,
  encoding: BufferEncoding = 'utf-8',
): string {
  return Buffer.from(base64, 'base64').toString(encoding);
}

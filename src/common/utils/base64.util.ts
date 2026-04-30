export function decodeBase64(
  base64: string,
  encoding: BufferEncoding = 'utf-8',
): string {
  return Buffer.from(base64, 'base64').toString(encoding);
}

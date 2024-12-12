import { Expose } from 'class-transformer';

export class ReadTokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

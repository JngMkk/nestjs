import { Module } from '@nestjs/common';
import { JwtCoreModule } from 'src/core/jwt/jwt.module';
import { AccessTokenGuard } from './guards/access-token.guard';
import { BasicTokenGuard } from './guards/basic-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
  imports: [JwtCoreModule],
  providers: [BasicTokenGuard, RefreshTokenGuard, AccessTokenGuard],
  exports: [BasicTokenGuard, RefreshTokenGuard, AccessTokenGuard],
})
export class AuthCoreModule {}

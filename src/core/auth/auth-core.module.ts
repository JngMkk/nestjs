import { Module } from '@nestjs/common';
import { JwtCoreModule } from 'src/core/jwt/jwt.module';
import { BasicTokenGuard } from './guards/basic-token.guard';
import { BearerTokenGuard } from './guards/bearer-token.guard';

@Module({
  imports: [JwtCoreModule],
  providers: [BasicTokenGuard, BearerTokenGuard],
  exports: [BasicTokenGuard, BearerTokenGuard],
})
export class AuthCoreModule {}

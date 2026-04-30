import { Module } from '@nestjs/common';
import { AuthCoreModule } from 'src/core/auth/auth-core.module';
import { JwtCoreModule } from 'src/core/jwt/jwt.module';
import { UsersModule } from 'src/domain/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, JwtCoreModule, AuthCoreModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthCoreModule],
})
export class AuthModule {}

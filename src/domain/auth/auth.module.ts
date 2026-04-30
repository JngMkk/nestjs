import { Module } from '@nestjs/common';
import { AuthCoreModule } from 'src/core/auth/auth-core.module';
import { UserModule } from 'src/domain/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, AuthCoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

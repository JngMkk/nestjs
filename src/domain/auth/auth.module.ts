import { Module } from '@nestjs/common';
import { JwtCoreModule } from 'src/core/jwt/jwt.module';
import { UsersModule } from 'src/domain/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, JwtCoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

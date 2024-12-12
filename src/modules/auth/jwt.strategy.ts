import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../users/users.service';
import { TokenPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
        config.get('JWT_SCHEME').toLowerCase(),
      ),
      secretOrKey: config.get('JWT_SECRET_KEY'),
      algorithms: [config.get('JWT_ALGORITHM')],
      issuer: config.get('JWT_ISSUER'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userService.getUserById(payload.aud);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

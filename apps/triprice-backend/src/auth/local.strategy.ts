import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../../shared/models/users/user';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const user: Omit<User, 'password'> = await this.authService.validateUser(
      email,
      password
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

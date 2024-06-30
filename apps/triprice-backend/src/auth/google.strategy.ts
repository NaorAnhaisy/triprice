import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, Provider } from './auth.service';
import { User } from '../../../shared/models/users/user';
import { AppConfigService } from '../config/AppConfig.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: Logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: AppConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getConfig().googleAuth.clientId,
      clientSecret: configService.getConfig().googleAuth.clientSecret,
      callbackURL: `${configService.getConfig().appUrl}:${
        configService.getConfig().portConfiguration.backendOutside
      }/api/auth/google/redirect`,
      passReqToCallback: true,
      scope: ['email', 'profile', 'phone'],
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const { name, emails, photos } = profile;
    this.logger.log({
      message: 'User validated from Google OAuth:',
      args: profile,
    });
    const user: User = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      avatar_url: photos[0].value,
    };

    this.logger.log({
      message: 'User initiated with google auth:',
      args: user,
    });

    try {
      const userJwt: string = await this.authService.validateOAuthLogin(
        user,
        profile.id,
        Provider.GOOGLE
      );
      done(null, userJwt);
    } catch (err) {
      console.error('Error in validate function at google.strategy file:', err);
      done(err, false);
    }
  }
}

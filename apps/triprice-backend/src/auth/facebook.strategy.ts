import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, Provider } from './auth.service';
import { User } from '../../../shared/models/users/user';
import { AppConfigService } from '../config/AppConfig.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger: Logger = new Logger(FacebookStrategy.name);

  constructor(
    configService: AppConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getConfig().facebookAuth.appId,
      clientSecret: configService.getConfig().facebookAuth.appSecret,
      callbackURL: `${configService.getConfig().appUrl}:${
        configService.getConfig().portConfiguration.backendOutside
      }/api/auth/facebook/redirect`,
      passReqToCallback: true,
      // scope: "email",
      profileFields: ["emails", "name", "photos"],
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ) {
    const { name, photos, emails } = profile;
    this.logger.log({
      message: 'User validated from Facebook OAuth:',
      args: profile,
    });
    const user: User = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      avatar_url: photos[0].value,
    };

    this.logger.log({
      message: 'User initiated with facebook auth:',
      args: user,
    });

    try {
      const userJwt: string = await this.authService.validateOAuthLogin(
        user,
        profile.id,
        Provider.FACEBOOK
      );
      done(null, userJwt);
    } catch (err) {
      console.error(
        'Error in validate function at facebook.strategy file:',
        err
      );
      done(err, false);
    }
  }
}

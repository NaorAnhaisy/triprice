import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../Crypto/Hashing.service';
import { UsersService } from '../users/users.service';
import { User } from '../../../shared/models/users/user';
import { TokenSet } from './TokenSet.interface';
import { deleteFile } from '../utils/FileHandler';

export enum Provider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService
  ) {}

  public async validateUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.usersService.findUserByEmail(email);
    this.logger.log({
      message: 'Validating user and found the user:',
      data: foundUser,
    });
    if (
      foundUser &&
      this.hashingService.compareHash(password, foundUser.password)
    ) {
      delete foundUser.password;
      return foundUser;
    }

    return null;
  }

  public async register(user: User) {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (existingUser) {
      this.logger.log({
        message: 'Exists user tried to register, the user:',
        data: existingUser,
      });
      deleteFile(user.avatar_url);
      throw new BadRequestException('Duplicate User Error', {
        cause: new Error(),
        description: 'Email already exists in system',
      });
    }

    const hashedPassword = this.hashingService.hashString(user.password.trim());
    user.password = hashedPassword;
    user.first_name = user.first_name.trim();
    user.last_name = user.last_name.trim();
    user.email = user.email.toLowerCase().trim();
    user.phone_number = user.phone_number.trim();
    user.avatar_url = user.avatar_url
      ? `${user.avatar_url.replace(/["\\"]/g, '/')}`
      : `https://api.multiavatar.com/${user.email.toLowerCase()}.png?apikey=MUN0hC9vlqQm7j`;
    await this.usersService.insertOneUser(user);

    this.logger.log({
      message: 'User registered to DB:',
      args: user,
    });
    return this.login(user);
  }

  public async login(user: User): Promise<TokenSet> {
    this.logger.log({
      message: 'User logged in:',
      args: user,
    });
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      connectedUser: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar_url: user.avatar_url,
      } as User,
    };
  }

  async validateOAuthLogin(
    user: User,
    thirdPartyId: string,
    provider: Provider
  ): Promise<string> {
    try {
      this.logger.log({
        message: 'User try to login with provider:',
        args: { provider, user },
      });
      if (!user) {
        return 'No user from oauth';
      }

      const userExists = await this.usersService.findUserByEmail(user.email);
      if (!userExists) {
        user.first_name = user.first_name.trim();
        user.last_name = user.last_name.trim();
        user.email = user.email.toLowerCase().trim();
        await this.usersService.insertOneUser(user);
        this.logger.log({
          message: 'New user registered via oauth auth:',
          args: user,
        });
      }

      const payload = { sub: { provider, thirdPartyId }, email: user.email };
      const jwt: string = this.jwtService.sign(payload);
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}

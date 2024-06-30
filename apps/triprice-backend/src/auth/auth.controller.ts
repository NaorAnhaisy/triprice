import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiConsumes } from '@nestjs/swagger';
import { AppConfigService } from '../config/AppConfig.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { diskStorage } from 'multer';
import path = require('path');
import { deleteFile } from '../utils/FileHandler';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: path.join(
          __dirname,
          './upload/avatars'
          // '../../../apps/triprice-backend/upload/avatars'
        ),
        filename: (_req, file, cb) => {
          return cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    })
  )
  async register(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
        fileIsRequired: false,
      })
    )
    avatar: Express.Multer.File,
    @Request() req
  ) {
    const avatarPath = avatar?.path;
    if (avatarPath) {
      const secure_url = await this.cloudinaryService
        .uploadImage(avatarPath)
        .catch((error) => {
          console.error('Got error from cloudinary: ', error);
          throw new BadRequestException('Invalid file type', {
            cause: new Error(),
            description:
              'Please insert file of type: jpg / jpeg / png / gif only and max size of 5MB!',
          });
        });
      deleteFile(avatarPath);
      req.body = { ...req.body, avatar_url: secure_url };
    }
    this.logger.log({
      message: 'Register user:',
      args: req.body,
    });
    return await this.authService.register(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    this.logger.log({
      message: 'Login user:',
      args: req.user,
    });
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  // handles the Google OAuth2 callback
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    this.logger.log({
      message: 'User redirected from google auth with jwt:',
      args: req.user,
    });
    const jwt: string = req.user;
    const loginRedirectUrl = `${this.configService.getConfig().appUrl}:${
      this.configService.getConfig().portConfiguration.frontend
    }/login`;
    if (jwt) res.redirect(`${loginRedirectUrl}/success/${jwt}`);
    else res.redirect(`${loginRedirectUrl}/failure`);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {
    // initiates the Facebook OAuth2 login flow
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req, @Res() res) {
    this.logger.log({
      message: 'User redirected from facebook auth with jwt:',
      args: req.user,
    });
    const jwt: string = req.user;
    const loginRedirectUrl = `${this.configService.getConfig().appUrl}:${
      this.configService.getConfig().portConfiguration.frontend
    }/login`;
    if (jwt) res.redirect(`${loginRedirectUrl}/success/${jwt}`);
    else res.redirect(`${loginRedirectUrl}/failure`);
  }
}

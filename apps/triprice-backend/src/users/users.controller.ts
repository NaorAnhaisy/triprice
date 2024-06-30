import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  ResponseOnUserPostRequest,
  ResetPasswordRequest,
  User,
} from '../../../shared/models/users/user';

@Controller('users')
export class UsersController {
  private readonly logger: Logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<User> {
    this.logger.debug({
      message: 'Get user profile received for:',
      args: req.user,
    });
    return this.usersService.findUserByEmail(req.user.email);
  }

  @Get('getAllUsers')
  async getAllUsers() {
    this.logger.debug({
      message: 'Get all users received',
    });
    return this.usersService.getAllUsers();
  }

  @Get('getById/:user_id')
  async findUserById(@Param('user_id') user_id: string) {
    this.logger.debug({
      message: 'Get by user ID received for',
      args: user_id,
    });
    return this.usersService.findUserById(user_id);
  }

  @Delete(':userID')
  async remove(
    @Param('userID') userID: string
  ): Promise<ResponseOnUserPostRequest> {
    this.logger.log({
      message: 'Deleting user id recieved for: ' + userID,
    });
    return await this.usersService.deleteOneUser(userID);
  }

  @Post('forgot/:userEmail')
  async forgotPassword(
    @Param('userEmail') userEmail: string
  ): Promise<ResponseOnUserPostRequest> {
    this.logger.log({
      message: 'Forgot password recieved for:',
      args: userEmail,
    });
    return await this.usersService.forgotPassword(userEmail);
  }

  @Post('reset')
  async resetPassword(
    @Body() body: ResetPasswordRequest
  ): Promise<ResponseOnUserPostRequest> {
    this.logger.log({
      message: 'Reset password recieved for:',
      args: body,
    });
    return await this.usersService.resetUserPassword(
      body.userNewPassword,
      body.resetToken
    );
  }
}

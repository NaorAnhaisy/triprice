import { Injectable, Logger } from '@nestjs/common';
import {
  ResponseOnUserPostRequest,
  User,
} from '../../../shared/models/users/user';
import { GraphqlService } from '../graphql/graphql.service';
import { CryptoUtils } from '../Crypto/cryptoUtils.service';
import { MailerService } from '../mailer/mailer.service';
import { HashingService } from '../Crypto/Hashing.service';
import { AppConfigService } from '../config/AppConfig.service';

const MILLISECONDS_IN_MINUTE = 60 * 1000; // Never change.
const FORGOT_PASSWORD_MINUTES = 60; // Can change.
const FORGOT_PASSWORD_MILLISECONDS =
  FORGOT_PASSWORD_MINUTES * MILLISECONDS_IN_MINUTE; // Never change.

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    private readonly graphqlService: GraphqlService,
    private readonly cryptoUtils: CryptoUtils,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
    private readonly configService: AppConfigService
  ) {}

  public async findUserByEmail(email: string): Promise<User | undefined> {
    return this.graphqlService.findUserByEmail(email.toLowerCase().trim());
  }

  public async findUserByResetToken(
    resetToken: string
  ): Promise<User | undefined> {
    return this.graphqlService.findUserByResetToken(resetToken.trim());
  }

  public async findUserById(user_id: string): Promise<User | undefined> {
    return this.graphqlService.findUserById(user_id);
  }

  public async getAllUsers(): Promise<User[]> {
    return this.graphqlService.getAllUsers();
  }

  public async insertOneUser(user: User): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertOneUser(user);
  }

  public async deleteOneUser(
    userID: string
  ): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.deleteOneUser(userID);
  }

  public async forgotPassword(
    userEmail: string
  ): Promise<ResponseOnUserPostRequest> {
    const foundUser = await this.findUserByEmail(userEmail);
    if (!foundUser) return { isSucceed: false, error: 'User not found' };

    const resetPasswordToken = this.cryptoUtils.createRandomString();
    const resetPasswordExpired = Date.now() + FORGOT_PASSWORD_MILLISECONDS;
    const updateUserResetPasswordResult = await this.updateUserResetPassword(
      userEmail,
      resetPasswordToken,
      resetPasswordExpired
    );
    const clientForgotPasswordUrl = `${this.configService.getConfig().appUrl}:${
      this.configService.getConfig().portConfiguration.frontend
    }/reset/${resetPasswordToken}`;
    if (updateUserResetPasswordResult.isSucceed) {
      await this.mailerService.sendMail(
        userEmail,
        'Triprice - Reset Password',
        'Hello,\n\n' +
          'You receive this message when you (or someone else) requested to reset the password for your account.\n' +
          'If you do want to reset the password, please enter to the following link in order to complete the process:\n\n' +
          clientForgotPasswordUrl +
          '\n\n' +
          'If you have not requested this, please ignore this email and your password will remain unchanged.\n\n' +
          'Yours, Triprice.',
        "<div style='direction:ltr'>" +
          '<h2>Hello,</h2>' +
          '<p>' +
          '<h3>' +
          'You receive this message when you (or someone else) requested to reset the password for your account. <br />' +
          'If you do want to reset the password, please enter to the following link in order to complete the process: <br />' +
          '</h3>' +
          '<h2>' +
          `<a target="_blank" rel="noopener noreferrer" href="${clientForgotPasswordUrl}">Click Here</a>` +
          '</h2>' +
          '</p>' +
          '<p>' +
          '<h3>' +
          'If you have not requested this, please ignore this email and your password will remain unchanged.' +
          '</h3>' +
          '</p>' +
          '<p>' +
          '<h2>' +
          'Yours, Triprice.' +
          '</h2>' +
          '</p>' +
          '</div>'
      );
    }

    updateUserResetPasswordResult.message =
      'Code for password recovery sent to the email: ' + userEmail;
    updateUserResetPasswordResult.subMessage =
      'Pay attention: The code will expired in ' +
      FORGOT_PASSWORD_MINUTES +
      ' minutes';
    return updateUserResetPasswordResult;
  }

  private async updateUserResetPassword(
    userEmail: string,
    resetPasswordToken: string,
    resetPasswordExpired: number
  ): Promise<ResponseOnUserPostRequest> {
    return await this.graphqlService.updateUserResetPassword(
      userEmail,
      resetPasswordToken,
      resetPasswordExpired
    );
  }

  public async resetUserPassword(
    userNewPassword: string,
    resetToken: string
  ): Promise<ResponseOnUserPostRequest> {
    const existingUser = await this.findUserByResetToken(resetToken);
    this.logger.log({
      message: 'Existing User requesting to reset password:',
      args: { existingUser, resetToken },
    });
    if (!existingUser) {
      this.logger.log({
        message: 'User not exists',
      });
      return {
        isSucceed: false,
        error: 'User not Exists',
        message: "Email doesn't exists in the system",
      };
    } else if (existingUser.reset_password_token !== resetToken) {
      this.logger.log({
        message: 'Wrong reset token received',
      });
      return {
        isSucceed: false,
        error: 'Invalid Token Error',
        message: 'Invalid reset token received',
      };
    } else if (existingUser.reset_password_expired <= Date.now()) {
      this.logger.log({
        message: 'Reset password token has expired',
      });
      return {
        isSucceed: false,
        error: 'Expired Reset Token',
        message: 'Reset password token has expired',
        subMessage: 'Please request reseting your password again',
      };
    }

    const hashedPassword = this.hashingService.hashString(
      userNewPassword.trim()
    );
    return await this.graphqlService.resetUserPassword(
      existingUser.email,
      hashedPassword
    );
  }
}

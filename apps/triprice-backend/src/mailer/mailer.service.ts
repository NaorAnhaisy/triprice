import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { AppConfigService } from '../config/AppConfig.service';

@Injectable()
export class MailerService {
  private readonly logger: Logger = new Logger(MailerService.name);
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: AppConfigService
  ) {}

  public async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    await this.mailerService
      .sendMail({
        to: to, // list of receivers
        from: this.configService.getConfig().gmail.user, // sender address
        subject: subject, // Subject line
        text: text, // plaintext body
        html: html, // HTML body content
      })
      .then(() => {
        this.logger.log({
          message: 'Mail sent successfully to ' + to,
        });
      })
      .catch((error) => {
        this.logger.error({
          message: 'Error accured while sending mail to ' + to,
          error: error,
        });
      });
  }
}

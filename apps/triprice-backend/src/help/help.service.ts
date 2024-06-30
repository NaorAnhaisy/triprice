import { Injectable } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { ResponseOnUserPostRequest } from 'apps/shared/models/users/user';

@Injectable()
export class HelpService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendHelpEmailToTriPriceAdmin(
    header: string,
    content: string
  ): Promise<ResponseOnUserPostRequest> {
    await this.mailerService.sendMail(
      'triprice123@gmail.com',
      header,
      content,
      content
    ).catch(err => {
      return { isSucceed: false, error: err };
    });

    return { isSucceed: true, error: null };
  }
}

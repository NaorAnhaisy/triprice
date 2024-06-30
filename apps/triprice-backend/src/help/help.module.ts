import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { HelpService } from './help.service';
import { HelpController } from './help.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [GraphqlModule, MailerModule],
  providers: [HelpService],
  exports: [HelpService],
  controllers: [HelpController],
})
export class HelpModule { }

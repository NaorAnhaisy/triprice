import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GraphqlModule } from '../graphql/graphql.module';
import { CryptoModule } from '../Crypto/Crypto.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [GraphqlModule, CryptoModule, MailerModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }

import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [GraphqlModule, MailerModule],
  providers: [TripsService],
  exports: [TripsService],
  controllers: [TripsController],
})
export class TripsModule { }

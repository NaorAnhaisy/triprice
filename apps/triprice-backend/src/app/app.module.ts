import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ApiModule } from '../apis/api.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AppConfigModule } from '../config/AppConfig.module';
import { AppConfigService } from '../config/AppConfig.service';
import { CostsModule } from '../costs/costs.module';
import { PlannedPricesModule } from '../plannedPrices/plannedPrices.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { TripsCostsCalculatorModule } from '../tripCostsCalculator/tripCostsCalculator.module';
import { TripsModule } from '../trips/trips.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelpModule } from '../help/help.module';

@Module({
  imports: [
    AppConfigModule,
    ApiModule,
    UsersModule,
    AuthModule,
    TripsModule,
    HelpModule,
    ReviewsModule,
    TripsCostsCalculatorModule,
    CostsModule,
    PlannedPricesModule,
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.getConfig().gmail.user,
            pass: configService.getConfig().gmail.password,
          },
        },
      }),
    }),
    CloudinaryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

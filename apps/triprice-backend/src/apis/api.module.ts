import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AirportController } from './airports/airport.controller';
import { AirportService } from './airports/airport.service';
import { AmadeusController } from './amadeus/amadeus.controller';
import { AmadeusService } from './amadeus/amadeus.service';
import { PaymentController } from './payments/payment.controller';
import { PaymentService } from './payments/payment.service';

@Module({
  imports: [HttpModule],
  controllers: [AmadeusController, AirportController, PaymentController],
  providers: [AmadeusService, AirportService, PaymentService],
  exports: [AmadeusService, AirportService]
})
export class ApiModule { }

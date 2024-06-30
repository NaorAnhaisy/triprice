import { Body, Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { TripsCostsCalculatorService } from './tripCostsCalculator.service';

@Controller('tripsCostsCalculator')
export class TripsCostsCalculatorController {
  constructor(private tripsCostsCalculatorService: TripsCostsCalculatorService) {}

  @Get('cityId/:cityId')
  async getCalculatedPricesByCityId(@Param('cityId') cityId: string) {
    return this.tripsCostsCalculatorService.findCalculatedPricesByCityId(cityId);
  }
}

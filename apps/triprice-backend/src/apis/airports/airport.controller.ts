import { Controller, Get, Param } from '@nestjs/common';
import { AirportService } from './airport.service';

@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) { }

  @Get('name/:name')
  getAirports(@Param('name') name: string) {
    return this.airportService.getAirports(name);
  }
}

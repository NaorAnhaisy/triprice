import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FlightSearchResult } from '../../../../shared/models/flights/flightSearchResult';
import { HotelSearchOffer } from '../../../../shared/models/hotels/hotelSearchOffer';
import { TripSearchResult } from '../../../../shared/models/trips/tripSearchResult';
import { TripSearchRequestBody } from './../../../../shared/models/trips/tripsSearchRequestBody';
import { AmadeusService } from './amadeus.service';

@Controller('amadeus')
export class AmadeusController {
  constructor(private readonly amadeusService: AmadeusService) { }

  @Get('cityCode/:keyword')
  getCityCode(@Param("keyword") keyword: string) {
    return this.amadeusService.getCityCode(keyword);
  }

  @Get('airlines/:airlineCode')
  getAirlineNameByCode(@Param("airlineCode") airlineCode: string) {
    return this.amadeusService.getAirlineNameByCode(airlineCode);
  }

  @Post('flights')
  getFlightOffersSearch(@Body() body: any): Promise<FlightSearchResult[]> {
    return this.amadeusService.getFlightOffersSearch(body);
  }

  @Post('hotels')
  getHotelOffersSearch(@Body() body: HotelSearchOffer) {
    return this.amadeusService.getHotelOffersSearch(body);
  }

  @Post('trips')
  getTripOfferSearch(@Body() body: TripSearchRequestBody): Promise<TripSearchResult> {
    return this.amadeusService.getTripOfferSearch(body);
  }
}

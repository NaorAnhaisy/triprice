import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Airport } from '../../../../shared/models/airports/airport';
import { AppConfigService } from '../../config/AppConfig.service';
@Injectable()
export class AirportService {
  private headers;
  constructor(
    private httpService: HttpService,
    private configService: AppConfigService
  ) {
    this.headers = {
      'APC-Auth': this.configService.getConfig().airports.key,
      'APC-Auth-Secret': this.configService.getConfig().airports.secret,
    };
  }

  getAirportData(airport: any): Airport {
    return {
      name: airport.name,
      iata: airport.iata,
    };
  }

  getURL = (name: string) =>
    `https://www.air-port-codes.com/api/v1/autocomplete?term=${name}`;

  async getAirports(name: string) {
    const airports: Airport[] = [];
    const result = await firstValueFrom(
      this.httpService.get(this.getURL(name), { headers: this.headers })
    );
    const data = result['data'];

    if (data['airports']) {
      const airportsData = data['airports'];
      airportsData.forEach((airport) => {
        if (airport['children']) {
          // It means that there is more than one airport in the same country that answer the criteria conditions
          airport['children'].forEach((airportChildren) =>
            airports.push(this.getAirportData(airportChildren))
          );
        }

        if (airport.city.toLowerCase().includes(name.toLowerCase())) {
          airports.push(
            this.getAirportData({
              ...airport,
              name: airport.city + ', ' + airport.country.name,
            })
          );
        } else {
          airports.push(
            this.getAirportData({
              ...airport,
              name: airport.name + ', ' + airport.country.name,
            })
          );
        }
      });
    } else {
      airports.push({ name: 'No airports found', iata: undefined });
    }
    return airports;
  }
}

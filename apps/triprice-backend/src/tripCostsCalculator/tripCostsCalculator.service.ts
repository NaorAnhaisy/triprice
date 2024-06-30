import { Injectable, Logger } from "@nestjs/common";
import { GraphqlService } from "../graphql/graphql.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as moment from 'moment';
import { Trip } from "apps/shared/models/trips/userTrip";
import * as _ from 'lodash';
import { CalculatedPrice } from "apps/shared/models/calculatedPrices/calculatedPrice";

@Injectable()
export class TripsCostsCalculatorService {
  private readonly logger: Logger = new Logger(TripsCostsCalculatorService.name);
  constructor(private readonly graphqlService: GraphqlService) { }

  public async findCalculatedPricesByCityId(cityId: string) {
    return this.graphqlService.findCalculatedPricesByCityId(cityId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async calculatePriceByYesterdayTrips() {
    this.logger.log({
      message: 'Start calculate avg price.',
    });
    const yesterdayDate = this.getPreviousDay();
    const tripsEndedYesterday: Trip[] = await this.graphqlService.findTripsByEndDate(yesterdayDate);
    this.logger.log({
      message: `fetch ${tripsEndedYesterday.length} trips from yesterday`,
    });

    for (const trip of tripsEndedYesterday) {
      await this.calculatePriceByTrip(trip);
    }
  }

  private async calculatePriceByTrip(trip: Trip) {
    const cityId = trip.city_id;
    const numberOfTravelers = trip.numberOfTravelers ?? 1;
    const numberOfDays = moment(trip.end_date).diff(moment(trip.start_date), 'days');

    const calculatedPrices = await this.graphqlService.findCalculatedPricesByCityId(cityId);
    const newCalculatedPrices: CalculatedPrice[] = [];
    
    const costsByCategory = _.groupBy(trip.costs,'category');
    Object.keys(costsByCategory).forEach(category => {
      const price = (_.sumBy(costsByCategory[category], 'cost') / numberOfDays) / numberOfTravelers;
      const currentCalculatedPrice = calculatedPrices.find(calculatedPrice => calculatedPrice.category == category);
      if (currentCalculatedPrice) {
        currentCalculatedPrice.price = 
        ((currentCalculatedPrice.numberOfTrips / (currentCalculatedPrice.numberOfTrips + 1)) * currentCalculatedPrice.price) + 
        ((1 / (currentCalculatedPrice.numberOfTrips + 1)) * price);

        currentCalculatedPrice.numberOfTrips = currentCalculatedPrice.numberOfTrips + 1;
      } else {
        newCalculatedPrices.push({
          city_id: cityId,
          category: category,
          price: price, 
          numberOfTrips: 1
        })
      }
    })

    //TODO CHANGE IT
    const hotelPrice = (trip.hotels[0].offers[0].price.total / numberOfDays) / numberOfTravelers;
    const hotelCalculatedPrice = calculatedPrices.find(calculatedPrice => calculatedPrice.category == 'hotels');
    if (hotelCalculatedPrice) {
      hotelCalculatedPrice.price = 
      ((hotelCalculatedPrice.numberOfTrips / (hotelCalculatedPrice.numberOfTrips + 1)) * hotelCalculatedPrice.price) + 
      ((1 / (hotelCalculatedPrice.numberOfTrips + 1)) * hotelPrice);

      hotelCalculatedPrice.numberOfTrips = hotelCalculatedPrice.numberOfTrips + 1;
    } else {
      newCalculatedPrices.push({
        city_id: cityId,
        category: 'hotels',
        price: hotelPrice, 
        numberOfTrips:  1 
      })
    }

    //TODO CHANGE IT
    const flightPrice = trip.flights[0].price.totalPrice / numberOfTravelers;
    const flightCalculatedPrice = calculatedPrices.find(calculatedPrice => calculatedPrice.category == 'flights');
    if (flightCalculatedPrice) {
      flightCalculatedPrice.price = 
      ((flightCalculatedPrice.numberOfTrips / (flightCalculatedPrice.numberOfTrips + 1)) * flightCalculatedPrice.price) + 
      ((1 / (flightCalculatedPrice.numberOfTrips + 1)) * flightPrice);

      flightCalculatedPrice.numberOfTrips = flightCalculatedPrice.numberOfTrips + 1;
    } else {
      newCalculatedPrices.push({
        city_id: cityId,
        category: 'flights',
        price: flightPrice, 
        numberOfTrips: 1
      })
    }
    this.logger.log({
      message: `try to update ${calculatedPrices.length} calculatedPrices`,
    });
    const updateRes = await this.graphqlService.updateCalculatedPrices(calculatedPrices);
    this.logger.log({
      message: `try to insert ${newCalculatedPrices.length} calculatedPrices`,
    });
    const createRes = await this.graphqlService.insertCalculatedPrice(newCalculatedPrices);
  }

  private getPreviousDay(): string {
    return  moment().subtract(1, 'days').format("YYYY-MM-DD");
  }
}
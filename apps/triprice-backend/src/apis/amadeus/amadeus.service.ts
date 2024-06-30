import { Injectable } from '@nestjs/common';
import { HotelSearchResult } from 'apps/shared/models/hotels/hotelSearchResult';
import { AxiosResponse } from 'axios';
import { omit } from "lodash";
import { FlightDetails, FlightSearchResult } from '../../../../shared/models/flights/flightSearchResult';
import { FlightSearchType } from '../../../../shared/models/flights/flightSearchType';
import { HotelSearchOffer } from "../../../../shared/models/hotels/hotelSearchOffer";
import { TripSearchResult } from "../../../../shared/models/trips/tripSearchResult";
import { TripSearchRequestBody } from '../../../../shared/models/trips/tripsSearchRequestBody';
import { AppConfigService } from '../../config/AppConfig.service';
import { getImagesData } from '../../utils/scraper';
import Amadeus = require("amadeus");

@Injectable()
export class AmadeusService {
  private amadeus: Amadeus;
  private airlinesCodesNamesMap: Map<string, string>;

  constructor(private readonly configService: AppConfigService) {
    this.amadeus = new Amadeus({
      clientId: this.configService.getConfig().amadeus.client.id,
      clientSecret: this.configService.getConfig().amadeus.client.secret,
    });

    this.airlinesCodesNamesMap = new Map();
  }

  public async getCityCode(keyword: string) {
    try {
      const response = await this.amadeus.referenceData.locations.cities.get({
        keyword: keyword,
      }).catch(function (error) {
        console.error("Error from amadeus:", error);
        return { isSucceed: false, message: error.description[0].detail };
      });

      return { isSucceed: true, data: response?.result?.data };
    } catch (error) {
      console.error(error);
      return { isSucceed: false, message: error.toString() };
    }
  }

  public async getAirlineNameByCode(airlineCode: string) {
    const MAX_TRIES = 3;
    let currentNumberOfTries = 0;
    while (currentNumberOfTries < MAX_TRIES) {
      try {
        const response = await this.amadeus.referenceData.airlines.get({
          airlineCodes: airlineCode
        }).catch(function (error) {
          if (error) {
            console.error("Error from amadeus:", error);
            return { isSucceed: false, message: error.description[0].detail };
          }
        });

        if (response?.result?.data?.length) {
          return { isSucceed: true, data: response.result.data[0]?.businessName };
        }

      } catch (error) {
        console.error(error);
        return { isSucceed: false, message: error.toString() };
      } finally {
        currentNumberOfTries++;
      }
    }
  }

  private reconstructBody(flightOfferBody: any) {

    return {
      ...omit(flightOfferBody, ['destinationLocationCodes']),
      destinationLocationCode: flightOfferBody.destinationLocationCodes[0],
      max: 15
    }
  }

  public async getFlightOffersSearch(body: any): Promise<FlightSearchResult[]> {
    console.log("Start searching for matched flights offers...");
    let searchType = FlightSearchType.SINGLE_DESTINATION;
    try {
      let results: AxiosResponse[] = [];
      let flightOfferBody = omit(body, ['budget', 'multiCity', 'combination'])
      if (body.combination) {
        searchType = FlightSearchType.COMBINE_DESTINATIONS;
        results.push(this.amadeus.shopping.flightOffersSearch
          .post(JSON.stringify(flightOfferBody)).catch(error => console.log('ERROR IN COMB', error)));
      } else if (body.multiCity) {
        searchType = FlightSearchType.MULTIPLE_DESTINATIONS;
        flightOfferBody.originDestinations.forEach(async dest => {
          results.push(this.amadeus.shopping.flightOffersSearch
            .get({ ...dest, max: 8 }).catch(error => console.log('ERROR IN multiCity', error)));
        });
      } else {
        searchType = FlightSearchType.SINGLE_DESTINATION;
        flightOfferBody = this.reconstructBody(flightOfferBody);
        results.push(this.amadeus.shopping.flightOffersSearch
          .get(flightOfferBody).catch(error => console.log('ERROR IN SingleCity', error)));
      }
      let resolvedResults = await Promise.all(results);
      const flights: Promise<FlightSearchResult>[] = [];

      resolvedResults.forEach(async result => {
        try {
          for (const flight of Array.from(result?.data)) {
            try {
              const flightObject = this.getFlightObject(flight, searchType)
              flightObject ? flights.push(flightObject) : null;
            } catch (error) {
              console.log('ERROR IN getFlightObject', error);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });

      return await Promise.all(flights);
    } catch (e) {
      console.error("Error in getFlightsOffersSearch:", e);
    } finally {
      console.log("Done searching for matched flights offers.");
    }
  }

  private async getFlightObject(flight, searchType: FlightSearchType): Promise<FlightSearchResult> {
    try {
      return await this.getFlightCompleteObject(flight, searchType);
    } catch (error) {
      console.error(
        'An error occured while trying to convert a flight with id',
        flight?.id,
        flight.itineraries[0].segments
      );
      return null;
    }
  }

  private async getFlightCompleteObject(flight: any, searchType: FlightSearchType): Promise<FlightSearchResult> {
    const { id, numberOfBookableSeats, price } = flight;
    let flightsObject;
    if (searchType === FlightSearchType.COMBINE_DESTINATIONS) {
      let { itineraries } = flight;
      itineraries = await Promise.all(itineraries.map(async itinerary => await this.getFlightDetails(itinerary)));
      itineraries = itineraries.flat();
      flightsObject = { flightsDetailsToDestination: itineraries };
    } else if (searchType === FlightSearchType.MULTIPLE_DESTINATIONS) {
      let { itineraries } = flight;
      itineraries = await Promise.all(itineraries.map(async itinerary => await this.getFlightDetails(itinerary)));
      flightsObject = { flightsDetailsToDestination: itineraries[0], flightsDetailsToSource: itineraries[1] };
    }
    else {
      const flightsDetailsToDestination = await this.getFlightDetails(flight.itineraries[0]);
      const flightsDetailsToSource = await this.getFlightDetails(flight.itineraries[1]);
      flightsObject = { flightsDetailsToDestination, flightsDetailsToSource }
    }

    return {
      id,
      numberOfBookableSeats,
      price: {
        currency: price.currency,
        totalPrice: price.grandTotal,
      },
      ...flightsObject
    }
  }

  private getFlightDetails(itinerary): Promise<FlightDetails[]> {
    const promises = itinerary.segments.map(async (segment) => {
      let carrierName: string;

      carrierName = this.airlinesCodesNamesMap.get(segment.carrierCode);
      if (segment.carrierCode && carrierName == null) {
        const res = await this.getAirlineNameByCode(segment.carrierCode);
        if (res?.isSucceed) {
          carrierName = res.data;
          this.airlinesCodesNamesMap.set(segment.carrierCode, carrierName);
        } else {
          carrierName = segment.carrierCode;
        }
      }

      return {
        duration: segment.duration,
        aircraftCode: segment.aircraft.code,
        carrierCode: segment.carrierCode,
        carrierName: carrierName,
        departure: segment.departure,
        arrival: segment.arrival,
      }
    });

    return Promise.all(promises);
  }

  async getHotelsId(cityCode: string): Promise<string[]> {
    return await this.amadeus.referenceData.locations.hotels.byCity
      .get({
        cityCode
      })
      .then(function (response) {
        const hotelsIds = response.data.map(hotel => hotel.hotelId);
        return hotelsIds.slice(0, 21);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  /**
   * Delay milliseconds
   * @param ms milliseconds to delay
   * @returns Promise that delays the execution of the code
   * @example await sleep (1000) - that delays the code by 1 second
   */
  private async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getHotelImages(hotelName: string, cityCode: string): Promise<string[]> {
    try {
      const NUMBER_OF_IMAGES = 10;
      const results = await getImagesData(`Hotel ${hotelName} ${cityCode}`, NUMBER_OF_IMAGES);
      return results.map(result => result.original);
    } catch (error) {
      console.error(`Error while trying to fetch hotel: ${hotelName}, and citycode: ${cityCode} image.`);
      console.error(error);
    }
  }

  public async getHotelOffersSearch(body: HotelSearchOffer | HotelSearchOffer[]): Promise<HotelSearchResult[]> {
    console.log("Start searching for matched hotel offers...");

    if (!body) {
      return;
    }
    try {
      let hotelIDs: Promise<string[]>[] = [];
      if ((body as HotelSearchOffer[]).length && (body as HotelSearchOffer[]).length > 1) {
        const hotels: HotelSearchOffer[] = body as HotelSearchOffer[];
        hotels.forEach(async (hotelSearchOffer, index) => {
          console.log("Going to look Combinations for hotel offers the body is ", hotelSearchOffer);
          hotelIDs.push(this.getHotelsId(hotelSearchOffer.cityCode[0]));
        })
      } else {
        const hotel: HotelSearchOffer = body as HotelSearchOffer;
        if (hotel?.cityCode.length > 1) {
          console.log("Going to look for hotel offers the body is ", hotel);
          const hotelPromises: Promise<string[]>[] = hotel.cityCode.map((cityCode) => this.getHotelsId(cityCode));
          hotelIDs = hotelPromises;
        } else {
          hotelIDs.push(this.getHotelsId(hotel.cityCode[0]));
        }
      }

      const resolvedHotelIDs = (await Promise.all(hotelIDs.flat())).flat();
      return await this.getHotelOffers(body as HotelSearchOffer, resolvedHotelIDs);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      console.log("Done searching for matched hotel offers.");
    }
  }



  private async getHotelOffers(body: HotelSearchOffer, hotelIDs: string[]) {
    let offers = [];
    if (!hotelIDs) {
      return [];
    }

    let i = 0;
    while (i < hotelIDs?.length) {
      await this.sleep(200);
      const response = await this.amadeus.shopping.hotelOffersSearch
        .get({
          hotelIds: JSON.stringify(hotelIDs.slice(i, i + 100)),
          adults: body?.adults,
          checkInDate: body?.checkInDate,
          checkOutDate: body?.checkOutDate,
        }).catch(function (error) {
          console.error("Error from amadeus:", error);
        });

      if (response?.data?.length > 0) {
        offers = offers.concat(response.data);
      }

      i += 100;
    }

    offers = await Promise.all(offers.map(async function (offer) {
      return (offer?.hotel) ?
        { ...offer, imagesURI: await this.getHotelImages(offer.hotel.name, offer.hotel.cityCode) } :
        offer;
    }, this));

    return offers;
  }

  public async getTripOfferSearch(body: TripSearchRequestBody): Promise<TripSearchResult> {
    try {
      if (!body.maxPrice) {
        delete body.maxPrice;
      }
      const [hotels, flights] = await Promise.all([
        this.getHotelOffersSearch(body.hotels ?? body.combinationHotel),
        this.getFlightOffersSearch(body.flights)
      ]);
      const trips: TripSearchResult = {
        hotels,
        flights
      };
      if (body.maxPrice) {
        trips.flights = trips.flights.filter(flight => (+flight.price.totalPrice) < body.maxPrice);
      }
      return trips;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

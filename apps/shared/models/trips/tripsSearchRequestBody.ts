import { HotelSearchOffer } from "../hotels/hotelSearchOffer";
import {FlightSearchRequestBody} from "../flights/flightSearchRequestBody"

export interface TripSearchRequestBody {
    hotels?: HotelSearchOffer;
    combinationHotel?: HotelSearchOffer[],
    flights: FlightSearchRequestBody;
    maxPrice?: number;
};
import {FlightSearchResult} from "../flights/flightSearchResult"
import { HotelSearchResult } from "../hotels/hotelSearchResult";

export interface TripSearchResult {
   flights: FlightSearchResult[];
   hotels: HotelSearchResult[];
}
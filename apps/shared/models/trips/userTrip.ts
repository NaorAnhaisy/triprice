import { Cost } from "../costs/cost";
import { FlightSearchResult } from "../flights/flightSearchResult";
import { HotelSearchResult } from "../hotels/hotelSearchResult";
import { PlannedPrice } from "../plannedPrices/plannedPrice";

export interface Trip {
  id?: string;
  user_id: string;
  city_id: string;
  numberOfTravelers: number;
  flights: FlightSearchResult[];
  flight_ids: string[];
  hotels: HotelSearchResult[];
  hotel_ids: string[];
  start_date: string;
  end_date: string;
  costs?: Cost[];
  plannedPrices?: PlannedPrice[];
};

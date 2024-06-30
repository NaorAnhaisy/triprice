import { FlightSearchResult } from './flightSearchResult';

export interface UpdateFlightData {
  tripId: string;
  flightId: string;
  flight: FlightSearchResult;
}

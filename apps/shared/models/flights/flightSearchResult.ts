export interface FlightSearchResult {
   id: string;
   numberOfBookableSeats: number;
   flightsDetailsToDestination: FlightDetails[];
   flightsDetailsToSource?: FlightDetails[];
   price: PriceDetails;
}

export interface PriceDetails {
   currency: string;
   totalPrice: number;
}
 
export interface FlightDetails {
   duration?: string;
   carrierCode: string,
   carrierName?: string,
   aircraftCode: string,
   departure: {
      iataCode: string,
      terminal: number,
      at: Date
   };
   arrival: {
      iataCode: string,
      terminal: number
      at: Date
   };
}

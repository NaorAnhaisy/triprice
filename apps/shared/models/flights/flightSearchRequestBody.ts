export interface FlightSearchRequestBody {
    originLocationCode: string,
    destinationLocationCodes: string[],
    departureDate: string,
    returnDate: string
    adults: number,
    budget?: string,
    // isOneWay: boolean,
    // currency: CurrencyType
};
import { FlightSearchType } from "../../../../shared/models/flights/flightSearchType";

export type SingleFlightObject = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate: string;
  adults: string;
};

const getCombinationDestinationObject = (id: number, originLocationCode: string, destinationLocationCode: string, date: string) => {
  return {
    id,
    originLocationCode,
    destinationLocationCode,
    departureDateTimeRange: {
      date
    }
  }
}

const getTravelers = (travelersAmount: number): { id: number, travelerType: string, fareOptions: string[] }[] => {
  let travelers: { id: number, travelerType: string, fareOptions: string[] }[] = [];

  for (let i = 1; i <= travelersAmount; i++) {
    travelers.push({
      id: i,
      travelerType: "ADULT",
      fareOptions: ["STANDARD"]
    })
  }

  return travelers;
}

const requestMetadata = (fieldName: string) => {
  return {
    sources: ["GDS"],
    searchCriteria: {
      maxFlightOffers: 75,
    },
    [fieldName]: true
  }
}


export const getSingleCityFlightObject = (originLocationCode: string, destinationLocationCode: string, departureDate: string, returnDate: string, adults: number): SingleFlightObject => {
  return {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults: '' + adults,
  }
}

export const getMultiCityFlighObject: any = (flightMetadata: any) => {
  let originDestinations: SingleFlightObject[] = [];
  if (flightMetadata.destinationLocationCodes.length > 1) {
    flightMetadata.destinationLocationCodes.forEach((destinationLocationCode: string) => {
      originDestinations.push(getSingleCityFlightObject(flightMetadata.originLocationCode, destinationLocationCode, flightMetadata.departureDate, flightMetadata.returnDate, flightMetadata.adults));
    })
  }
  return {
    originDestinations,
    ...requestMetadata('multiCity')
  }
}


export const getCombinationFlightObject: any = (originLocationCodes: string[], destinationLocationCodes: string[], dates: string[], travelersAmount: number, searchType: FlightSearchType) => {
  let originDestinations: any = [];
  const travelers = getTravelers(travelersAmount);

  if (originLocationCodes.length === destinationLocationCodes.length) {
    originLocationCodes.forEach((originLocationCode, index) => {
      originDestinations.push(getCombinationDestinationObject(index, originLocationCode, destinationLocationCodes[index], dates[index]));
    })
  }

  return {
    originDestinations,
    travelers,
    ...requestMetadata('combination')
  }
}
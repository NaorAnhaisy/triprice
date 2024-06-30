import { Pipe, PipeTransform } from '@angular/core';
import { FlightSearchResult } from '../../../../../shared/models/flights/flightSearchResult';
import { TripService } from '../../services/trip.service';

@Pipe({ name: 'filterFlights' })
export class FilterFlightsPipe implements PipeTransform {
    constructor(private tripService: TripService) { }
    transform(flights: FlightSearchResult[] | undefined): FlightSearchResult[] {
        if (!flights) {
            return []
        }

        const currentDest = this.tripService.currentShownCombinationDestionation$;
        return flights.filter(flight => {
            let isIncluded = false;
            flight.flightsDetailsToDestination.forEach(flight => {
                if (flight.arrival.iataCode === currentDest) {
                    isIncluded = true;
                }
            });

           return isIncluded
        })

    }
}
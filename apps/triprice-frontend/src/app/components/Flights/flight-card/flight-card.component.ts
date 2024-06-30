import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FlightSearchResult } from '../../../../../../shared/models/flights/flightSearchResult';
import { TripService } from '../../../services/trip.service';

@Component({
  selector: 'triprice-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss'],
})
export class FlightCardComponent implements OnInit {
  constructor(public tripService: TripService, private router: Router) { }
  @Input() flight: FlightSearchResult;
  @Input() tripId: string;
  @Input() isOrderSummary: boolean;
  @Input() isOrdered?: boolean;
  @Input() isCombination: boolean = false;
  @Output() nextFlightsPage: EventEmitter<void>;

  ngOnInit(): void {
    console.log(this.flight);
  }

  goToHotelOptions(flightResult: FlightSearchResult) {
    if (this.isCombination) {
      this.nextFlightsPage.emit();
    } else {
      this.tripService.selectedCityId$.next(flightResult.flightsDetailsToDestination[flightResult.flightsDetailsToDestination.length - 1].arrival.iataCode);
    }
    this.tripService.selectedFlights$.push(flightResult);
    if (this.tripId) {
      this.tripService.updateFlight(
        this.tripId,
        flightResult.id,
        flightResult
      );
      this.router.navigate(['/myTrips']);
    } else {
      if (!(this.tripService.trips$.value.hotels?.length > 0)) {
        this.router.navigate(['/summary']);
      } else {
        this.router.navigate(['/hotelOptions']);
      }
    }
  }
}

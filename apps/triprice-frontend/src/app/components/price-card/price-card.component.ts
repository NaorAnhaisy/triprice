import { Component, Input } from '@angular/core';
import { Trip } from '../../../../../shared/models/trips/userTrip';
import { AuthService } from '../../services/auth.service';
import { TripService } from './../../services/trip.service';

@Component({
  selector: 'triprice-price-card',
  templateUrl: './price-card.component.html',
  styleUrls: ['./price-card.component.scss'],
})
export class PriceCardComponent {
  constructor(
    private tripService: TripService,
    private authService: AuthService
  ) { }
  @Input() hotelprice: number | null;
  @Input() flightprice: number;
  @Input() currency: string;
  @Input() adults: number;
  @Input() isOrdered?: boolean;

  sumPrice(x: number, y: number) {
    return Number(x || 0) + Number(y || 0);
  }

  public orderFlightAndHotel(): void {
    const trip: Trip = {
      start_date: this.tripService.selectedStartDate$.value,
      end_date: this.tripService.selectedEndDate$.value,
      city_id: this.tripService.selectedCityId$.value,
      flights: this.tripService.selectedFlights$,
      hotels: this.tripService.selectedHotels$,
      flight_ids: this.tripService.selectedFlights$.map(({ id }) => id),
      hotel_ids: this.tripService.selectedHotels$?.map(({ hotel }) => hotel.hotelId),
      numberOfTravelers: this.tripService.selectedNumberOfTravelers$.value,
      user_id: this.authService.currentUserValue?.id?.toString() ?? ''
    };

    this.tripService.create(trip);
  }
}

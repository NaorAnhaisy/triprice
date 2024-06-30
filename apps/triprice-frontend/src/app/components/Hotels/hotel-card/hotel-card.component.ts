import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HotelSearchResult } from '../../../../../../shared/models/hotels/hotelSearchResult';
import { TripService } from '../../../services/trip.service';

@Component({
  selector: 'triprice-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss'],
})
export class HotelCardComponent {
  constructor(public tripService: TripService, private router: Router) { }

  @Input() hotel: HotelSearchResult;
  @Input() tripId: string;
  @Input() isOrderSummary: boolean;
  @Output() nextPage: EventEmitter<void> = new EventEmitter();

  private isLastDestination(): boolean {
    return this.tripService.currentShownCombinationDestionation$ === this.tripService.selectedCombinationDestinations$![this.tripService.selectedCombinationDestinations$!.length - 1];
  }
  goToSummaryPage(hotelResult: HotelSearchResult) {
    this.tripService.selectedHotels$.push(hotelResult);

    if (this.tripService.currentShownCombinationDestionation$ && !this.isLastDestination()) {
      this.nextPage.emit();
      return;
    }

    if (this.tripId) {
      this.tripService.updateHotel(
        this.tripId,
        hotelResult.hotel.hotelId,
        hotelResult
      );
      this.router.navigate(['/myTrips']);
    } else {
      this.router.navigate(['/summary']);
    }
  }
}

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'triprice-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {

  constructor(public tripService: TripService, private location: Location) { }

  ngOnInit(): void {
    this.tripService.currentStage$.next(3);
  }

  backClicked() {
    this.location.back();
  }


  public areThereHotels(hotels: any): boolean {
    return !!(hotels && hotels.length > 0);
  }

  public getHotelPrice() {
    try {
      let sum = 0;
      const hotels = this.tripService.selectedHotels$;
      this.areThereHotels(hotels) ? hotels.forEach(hotel => { sum += +hotel.offers[0].price.total }) : 0;
      return sum;
    } catch (e) {
      console.error("Error reading trip price", e);
      return 0;
    }
  }
}

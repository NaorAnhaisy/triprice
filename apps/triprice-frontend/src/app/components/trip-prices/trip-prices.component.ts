import { Component, Input } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { CalculatedPrice } from '../../../../../shared/models/calculatedPrices/calculatedPrice';

@Component({
  selector: 'triprice-trip-prices',
  templateUrl: './trip-prices.component.html',
  styleUrls: ['./trip-prices.component.scss']
})
export class TripPricesComponent {
  @Input() calculatedPrices: CalculatedPrice[] | null;

  constructor(public tripService: TripService) {}
}

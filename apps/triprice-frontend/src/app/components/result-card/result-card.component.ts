import { Component } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'triprice-result-card',
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.scss'],
})
export class ResultCardComponent {
  constructor(public tripService: TripService, private router: Router) { }

  returnToSearchPage() {
    this.tripService.resetTrips();
    this.router.navigate(['/search']);
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightSearchResult } from 'apps/shared/models/flights/flightSearchResult';
import * as _ from 'lodash';
import { TripService } from '../../../services/trip.service';

@Component({
  selector: 'triprice-flight-options',
  templateUrl: './flight-options.component.html',
  styleUrls: ['./flight-options.component.scss'],
})
export class FlightOptionsComponent implements OnInit {
  onlyDirectFlights = false;
  maxPrice = 20000;
  public tripId: string;
  flights: FlightSearchResult[] = [];
  filteredFlights: FlightSearchResult[] = [];
  loading = true;

  constructor(public tripService: TripService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    this.tripService.trips$.subscribe(trips => {
      this.flights = _.sortBy(trips.flights, flight =>
        flight.price.totalPrice
      );
      this.filterFlights();
    if (this.flights.length >= 1)
        this.loading = false;
      if (this.tripService.selectedCombinationDestinations$) {
        console.log(this.tripService.selectedCombinationDestinations$);
        this.tripService.currentShownCombinationDestionation$ = this.tripService.selectedCombinationDestinations$![this.tripService.currentCombinationDestinationIndex$!];
      }
    })

    this.route.queryParams.subscribe((params) => {
      this.tripId = params['tripId'];
    });

    this.tripService.currentStage$.next(1);
  }

  filterFlights() {
    this.filteredFlights = this.flights!.filter(flight => {
      if (this.onlyDirectFlights) {
        if (flight.flightsDetailsToDestination.length > 1 ||
          (flight.flightsDetailsToSource && flight.flightsDetailsToSource.length > 1)) {
          return false;
        }
      }

      if (flight.price.totalPrice > this.maxPrice) {
        return false;
      }

      return true;
    });
  }
}

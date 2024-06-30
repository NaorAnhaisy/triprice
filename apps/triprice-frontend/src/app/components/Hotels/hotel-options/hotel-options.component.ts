import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelSearchResult } from 'apps/shared/models/hotels/hotelSearchResult';
import * as _ from 'lodash';
import { TripService } from '../../../services/trip.service';


@Component({
  selector: 'triprice-hotel-options',
  templateUrl: './hotel-options.component.html',
  styleUrls: ['./hotel-options.component.scss'],
})
export class HotelOptionsComponent implements OnInit {
  public tripId: string;
  hotels: HotelSearchResult[] = [];
  currentDest: string;
  maxPrice = 10000;
  filteredHotels?: HotelSearchResult[] = [];
  loading = true;
  filteredHotelsByLocation?: HotelSearchResult[] = [];

  constructor(public tripService: TripService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;

    // Accessing queryParams
    this.route.queryParams.subscribe(params => {
      this.tripId = params['tripId'];
    });

    this.hotels = this.tripService.trips$.value.hotels
    this.currentDest = this.tripService.currentShownCombinationDestionation$ ?? this.tripService.selectedCityId$.value;
    this.filterHotelsByLocation();
    this.hotels = _.sortBy(this.tripService.trips$.value.hotels, hotel =>
      hotel.offers[0].price.total
    )

    if (this.hotels.length >= 1) {
      this.loading = false;
    }

    this.tripService.currentStage$.next(2);
  }

  goNextPage() {
    this.tripService.currentShownCombinationDestionation$ = this.tripService.selectedCombinationDestinations$![++this.tripService.currentCombinationDestinationIndex$!]
    this.currentDest = this.tripService.currentShownCombinationDestionation$;
    this.filterHotelsByLocation();
  }

  filterHotelsByLocation() {
    this.filteredHotelsByLocation = this.tripService.trips$.value.hotels.filter(({ hotel }) => hotel.cityCode === this.currentDest);
    this.filterHotelsByPrice();
  }

  backClicked() {
    this.tripService.selectedFlights$.pop();
    this.location.back();
  }

  filterHotelsByPrice() {
    this.filteredHotels = this.filteredHotelsByLocation!.filter(hotel => {
      if (hotel.offers[0].price.total > this.maxPrice) {
        return false;
      }

      return true;
    });
  }
}
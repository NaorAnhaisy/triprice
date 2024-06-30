import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/index';
import { ThemePalette } from '@angular/material/core/index';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime } from 'rxjs';
import { Airport } from '../../../../../shared/models/airports/airport';
import { FlightSearchResult } from '../../../../../shared/models/flights/flightSearchResult';
import { FlightSearchType } from '../../../../../shared/models/flights/flightSearchType';
import { Group } from '../../../../../shared/models/groups/group';
import { UserInGroup } from '../../../../../shared/models/groups/userInGroup';
import { HotelSearchOffer } from '../../../../../shared/models/hotels/hotelSearchOffer';
import { TripSearchRequestBody } from '../../../../../shared/models/trips/tripsSearchRequestBody';
import { AirportService } from '../../services/airport.service';
import { AuthService } from '../../services/auth.service';
import { getCombinationFlightObject, getMultiCityFlighObject } from '../../services/flight.service';
import { TripService } from '../../services/trip.service';
import { ChooseGroupComponent } from '../choose-group/choose-group.component';


@Component({
  selector: 'triprice-search-trip',
  templateUrl: './search-trip.component.html',
  styleUrls: ['./search-trip.component.scss']
})
export class SearchTripComponent implements OnInit {

  // Airport variables section
  @ViewChild('singleAirportInput')
  singleAirportInput: ElementRef<HTMLInputElement>;
  @ViewChild('multipleAirportsInput')
  multipleAirportsInput: ElementRef<HTMLInputElement>;
  @ViewChild('originInput')
  originInput: ElementRef<HTMLInputElement>;

  @ViewChildren('sourceCombinationInput') sourceCombinationInput: QueryList<ElementRef>;
  @ViewChildren('destinationCombinationInput') destinationCombinationInput: QueryList<ElementRef>;
  @ViewChildren('datesCombinationInput') datesCombinationInput: QueryList<ElementRef>;

  selectedAirports: string[] = [];
  airports$: Observable<Airport[]>
  airportsCtrl = new FormControl('');
  chosenSearchType: FlightSearchType = FlightSearchType.SINGLE_DESTINATION;
  searchTypes = FlightSearchType;
  public groups$: Observable<Group[]>;
  public userInGroup$: Observable<UserInGroup[]>;
  public sharedGroup$: Observable<Group>;
  public allUserGroups$: Group[] = [];
  public loading = true;
  public searchForHotels = true;

  flights: FlightSearchResult[] = [];
  rows: any[] = [{}];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  numberOfTravelersControl = new FormControl(1);
  maxPrice = new FormControl(0);
  todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  inputSubject = new Subject<string>();
  color: ThemePalette = undefined;

  constructor(private airportService: AirportService, private router: Router,
    public tripService: TripService, private datePipe: DatePipe, private _dialog: MatDialog, private authenticationService: AuthService
  ) {

    this.groups$ = this.tripService.findGroupByUserId(this.authenticationService.currentUserValue?.id?.toString() ?? '');
    this.userInGroup$ = this.tripService.findUserInGroupByUserId(this.authenticationService.currentUserValue?.id?.toString() ?? '');
  }

  ngOnInit() {
    this.tripService.selectedGroup$ = null;
    this.inputSubject.pipe(
      debounceTime(300)
    ).subscribe(value => {
      console.log('input value', value);
      this.airports$ = this.airportService.fetchAirports(value)
    });

    this.groups$.subscribe(val => {
      if (val) {
        val.forEach(el => this.allUserGroups$.push(el));
      }

      this.userInGroup$.subscribe(val => {
        if (val) {
          val.forEach((el, i) => {
            this.tripService.findGroupById(el.group_id ?? '').subscribe(obj => this.allUserGroups$.push(obj));

            if (i === val.length - 1) {
              this.loading = false;
            }
          })
        } else
          this.loading = false;
      }
      );
    });
  }

  isCombination(): boolean {
    return this.chosenSearchType === this.searchTypes.COMBINE_DESTINATIONS;
  }

  addRow() {
    this.rows.push({});
  }

  removeRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    }
  }

  add(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value || '').trim();
    if (value && this.selectedAirports.length <= 4) {
      this.selectedAirports.push(value);
    }

    this.airportsCtrl.setValue(null);
    this.multipleAirportsInput.nativeElement.value = '';
  }

  getChosenSearchType(): FlightSearchType {
    return Object.keys(this.searchTypes)[this.chosenSearchType] as FlightSearchType;
  }

  remove(airportIATA: string): void {
    const index = this.selectedAirports.indexOf(airportIATA);

    if (index >= 0) {
      this.selectedAirports.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAirports.push(event.option.viewValue);
    this.singleAirportInput.nativeElement.value = '';
    this.airportsCtrl.setValue(null);
  }


  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.inputSubject.next(value);
  }

  public isSingleDestination(): boolean {
    return this.chosenSearchType === FlightSearchType.SINGLE_DESTINATION;
  }

  disableButton(): boolean {
    return false; // (!this.range.value.start || !this.range.value.end) && !this.combinationDates?.nativeElement.;
  }

  private getChildrenValues(fatherElement: QueryList<ElementRef>) {
    return fatherElement.map(({ nativeElement }) => nativeElement.value)
  }

  private getFlightSearchMetadata() {
    return {
      originLocationCode: this.originInput?.nativeElement?.value,
      destinationLocationCodes: this.isSingleDestination() ? [this.singleAirportInput?.nativeElement?.value] : this.selectedAirports,
      departureDate: this.datePipe.transform(this.range.value.start, "yyyy-MM-dd") as string,
      returnDate: this.datePipe.transform(this.range.value.end, "yyyy-MM-dd") as string,
      adults: this.numberOfTravelersControl.value ?? 1,
    }
  }

  private getHotelsObject(flightMetadata: any) {
    return {
      adults: flightMetadata.adults,
      cityCode: flightMetadata.destinationLocationCodes,
      checkInDate: flightMetadata.departureDate,
      checkOutDate: flightMetadata.returnDate,
      imagesURI: []
    }
  }

  getMultiCityFlights() {
    const flightMetadata = this.getFlightSearchMetadata();

    const tripObject: TripSearchRequestBody = {
      flights: getMultiCityFlighObject(flightMetadata),
      maxPrice: this.maxPrice.value ?? undefined,
      hotels: this.searchForHotels ? this.getHotelsObject(flightMetadata) : undefined
    }

    return tripObject
  }

  private getSingleCityFlights() {
    const flightMetadata = this.getFlightSearchMetadata();
    const tripObject: TripSearchRequestBody = {
      flights: flightMetadata,
      maxPrice: this.maxPrice.value ?? undefined,
      hotels: this.searchForHotels ? this.getHotelsObject(flightMetadata) : undefined
    };

    return tripObject;
  }

  private getCombinationCitiesFlights() {
    const sourceLocationCodes = this.getChildrenValues(this.sourceCombinationInput);
    const destinationLocationCodes = this.getChildrenValues(this.destinationCombinationInput)
    const dates = this.getChildrenValues(this.datesCombinationInput).map((date: string) => this.datePipe.transform(new Date(date), "yyyy-MM-dd") as string);
    const adults = this.numberOfTravelersControl.value as number;

    const hotels: HotelSearchOffer[] = [];
    dates.forEach((date, index) => {
      hotels.push({
        adults,
        cityCode: [destinationLocationCodes[index]],
        checkInDate: date,
        checkOutDate: index + 1 < dates.length ? dates[index + 1] : date,
        imagesURI: []
      })
    });

    this.tripService.selectedCombinationDestinations$ = destinationLocationCodes;
    this.tripService.currentCombinationDestinationIndex$ = 0;


    const tripObject: TripSearchRequestBody = {
      flights: getCombinationFlightObject(sourceLocationCodes, destinationLocationCodes, dates, adults),
      combinationHotel: hotels,
      maxPrice: this.maxPrice.value ?? undefined
    };

    return tripObject
  }

  getTripObject(): TripSearchRequestBody {
    switch (this.chosenSearchType) {
      case FlightSearchType.SINGLE_DESTINATION:
        return this.getSingleCityFlights();
      case FlightSearchType.MULTIPLE_DESTINATIONS:
        return this.getMultiCityFlights();
      case FlightSearchType.COMBINE_DESTINATIONS:
        return this.getCombinationCitiesFlights();
    }
  }

  fetchFlights() {
    let tripObject: TripSearchRequestBody = this.getTripObject();

    this.tripService.resetTrips();
    this.tripService.fetchTrips(tripObject);

    this.tripService.selectedStartDate$.next(tripObject.flights.departureDate ?? (tripObject.flights as any).originDestinations[0].departureDate ?? (tripObject.flights as any).originDestinations[0].departureDateTimeRange.date);
    this.tripService.selectedEndDate$.next(tripObject.flights.returnDate ?? (tripObject.flights as any).originDestinations[0].returnDate ?? (tripObject.flights as any).originDestinations[(tripObject.flights as any).originDestinations.length - 1].departureDateTimeRange.date);
    this.tripService.selectedNumberOfTravelers$.next(tripObject.flights.adults ?? ((tripObject as any).flights.originDestinations[0].adults) ?? (tripObject.flights as any).travelers.length);
    this.tripService.selectedCityId$.next(this.getCityId(tripObject));
    this.router.navigate(['/results']);
  }

  getCityId(tripObject: any): string {
    return (tripObject.flights.destinationLocationCodes) ? (tripObject.flights.destinationLocationCodes[0]) : tripObject.flights.originDestinations[0].originLocationCode
  }

  isMultiCity(): boolean {
    return this.chosenSearchType === FlightSearchType.MULTIPLE_DESTINATIONS;
  }

  onSelectGroup(group: Group) {
    this.tripService.selectedGroup$ = group;
    this.tripService.findUserInGroupByGroupId(group.id ?? '').subscribe(val => {
      this.tripService.selectedUsersInGroup$ = val;
      this.numberOfTravelersControl = new FormControl(1 + (val?.length ?? 0));
    });
  }

  openGroupsDialog() {
    const dialogRef = this._dialog.open(ChooseGroupComponent, {
      data: this.allUserGroups$
    });

    dialogRef.afterClosed().subscribe((group: Group) => {
      if (group) {
        this.onSelectGroup(group);
      }
    });
  }
}

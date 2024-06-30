import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { PlannedPrice } from '../../../../../shared/models/plannedPrices/plannedPrice';
import { UserInTrip } from '../../../../../shared/models/trips/userInTrip';
import { Trip } from '../../../../../shared/models/trips/userTrip';
import { User } from '../../../../../shared/models/users/user';
import { EditTripMembersComponent } from '../../components/edit-trip-members/edit-trip-members.component';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { UserService } from '../../services/user.service';
import { AddMembersComponent } from '../add-members/add-members.component';
import {
  PlannedPricesComponent,
  PlannedPricesInput,
} from '../planned-prices/planned-prices.component';
import { ConfirmDialogComponent } from './dialog/dialog-my-trips.component';

@Component({
  selector: 'triprice-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss'],
})
export class MyTripsComponent implements OnInit {
  public trips$: Observable<Trip[]>;
  public tripsArray$: Trip[] = [];
  public sharedUsersInTrips$: Observable<UserInTrip[]>;
  public sharedTrips$: Trip[] = [];
  public users$: Observable<User[]>;
  public usersInTrip$: Observable<UserInTrip[]>;
  public loading = true;
  public tripUsers = new FormControl();
  public usersInTrip: { [id: string]: User[] } = {};

  constructor(
    public dialog: MatDialog,
    private tripsService: TripService,
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthService,
    private _dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.loadTrips();
    this.users$ = this.userService.getAll();
  }

  public areThereHotels(trip: Trip): boolean {
    return !!(trip.hotels && trip.hotels.length > 0);
  }

  public getHotelPrice(trip: Trip) {
    try {
      let sum = 0;
      this.areThereHotels(trip) ? trip.hotels.forEach(hotel => { sum += +hotel.offers[0].price.total }) : 0;
      return sum;
    } catch (e) {
      console.error("Error reading trip price", trip);
      return 0;
    }
  }

  public getNewUsersInTrips() {
    this.trips$.subscribe((trips) => {
      trips?.forEach((trip) => {
        if (trip.id) {
          this.tripsService
            .getUsersInTrip(trip.id)
            .subscribe((usersInThisTrip) => {
              const newUsers: User[] = [];

              this.users$.subscribe((allUsers) => {
                allUsers.forEach((user, i) => {
                  if (user.id) {
                    if (
                      !usersInThisTrip ||
                      !(
                        usersInThisTrip.filter((e) => e.user_id === user.id)
                          .length > 0
                      )
                    )
                      newUsers.push(user);

                    if (i === allUsers.length - 1)
                      this.usersInTrip[trip.id ?? ''] = newUsers;
                  }
                });
              });
            });
        }
      });
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getNewUsersInTrips();

    this.trips$.subscribe((val) => {
      console.log('trips are: ', val);
      this.loading = false;
      this.tripsArray$ = val;
      this.tripsArray$ = this.tripsArray$.filter(trip => (trip.flights as any) !== 'undefined').map(trip => {
        if ((trip as any).hotels === 'undefined') {
          trip.hotels = [];
        }
        return {
          ...trip,
          flights: new Array(trip.flights).flat(),
          hotels: new Array(trip.hotels).flat()
        }
      })
    });

    this.users$.subscribe((val) => {
      console.log('users are: ', val);
    });
  }

  // addMembersToTrip(tripId: any) {
  //   this.loading = true;
  //   if (this.tripUsers.value && tripId) {
  //     const usersInTrip1: UserInTrip[] = [];
  //     this.tripUsers.value.forEach((val: User) => {
  //       usersInTrip1.push({ user_id: val.id ?? '', trip_id: tripId });
  //     });
  //     this.tripsService.addUsersToTrip(usersInTrip1, tripId);
  //     this.tripUsers.value.forEach((userToBeDeleted: User) => {
  //       this.usersInTrip[tripId] = this.usersInTrip[tripId].filter(
  //         (el) => el.id !== userToBeDeleted.id
  //       );
  //     });
  //     this.loading = false;
  //     this.tripUsers = new FormControl();
  //   } else this.loading = false;
  // }

  moveToTrackingTripPage(tripId: any) {
    this.router.navigate([`/traking/${tripId}`]);
  }

  moveToPaymentPage(tripId: any, user_id: any) {
    this.router.navigate([`/payments/${tripId}/${user_id}`]);
  }

  public handleRemoveTrip(trip: Trip): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Proceed with removing the trip
        this.tripsService.remove(trip);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }

  public handleRemoveSharedTrip(trip: Trip): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.sharedUsersInTrips$.subscribe((val) => {
          const found = val.find(
            (element) =>
              element.user_id ===
              this.authenticationService.currentUserValue?.id?.toString() &&
              trip.id === element.trip_id
          );

          if (found) this.tripsService.removeUserFromTrip(found);
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }

  public getFlightPrice(trip: Trip): number {
    let sum: number = 0;
    if (trip.flights.length) {
      trip.flights.forEach((flight) => sum += +flight.price.totalPrice);
    } else {
      sum = (trip.flights as any).price.totalPrice;
    }
    return sum;
  }

  public getCurrency(trip: any) {
    if (trip.flights.length) {
      return trip.flights[0].price.currency;
    } else {
      return trip.flights.price.currency
    }
  }

  public loadTrips(): void {
    this.trips$ = this.tripsService.findTripsByUserId(
      this.authenticationService.currentUserValue?.id?.toString() ?? ''
    );

    this.sharedUsersInTrips$ = this.tripsService.getUsersInTripByUserId(
      this.authenticationService.currentUserValue?.id?.toString() ?? ''
    );

    this.sharedUsersInTrips$.subscribe((val) => {
      val?.forEach((data) => {
        this.tripsService
          .findTripsByTripId(data.trip_id ?? '')
          .subscribe((trip) => {
            this.sharedTrips$.push(trip);
          });
      });
    });
  }

  public handleEditHotel(trip: Trip): void {
    //TODO Change it
    const originLocationCode = trip.flights[0].flightsDetailsToDestination[0].departure.iataCode;
    const destinationLocationCode =
      trip.flights[0].flightsDetailsToDestination[0].arrival.iataCode;
    const startDate = trip.start_date;
    const endDate = trip.end_date;
    const adults = trip.flights[0].numberOfBookableSeats;
    this.tripsService.fetchTrips({
      flights: {
        originLocationCode,
        destinationLocationCodes: [destinationLocationCode],
        departureDate: startDate,
        returnDate: endDate,
        adults: adults,
      },
      hotels: {
        adults: adults as number,
        cityCode: [destinationLocationCode],
        checkInDate: startDate,
        checkOutDate: endDate,
        imagesURI: [],
      },
    });
    this.tripsService.selectedStartDate$.next(startDate);
    this.tripsService.selectedEndDate$.next(endDate);
    this.tripsService.selectedNumberOfTravelers$.next(adults);
    this.tripsService.selectedCityId$.next(destinationLocationCode);
    // this.tripsService.selectedFlights$ = trip.flight;
    this.router.navigate(['/hotelOptions'], {
      queryParams: { tripId: trip.id },
    });
  }

  public handleEditFlight(trip: Trip): void {
    //TODO Change It
    const originLocationCode = trip.flights[0].flightsDetailsToDestination[0].departure.iataCode;
    const destinationLocationCodes =
      trip.flights[0].flightsDetailsToDestination.map(
        (flight) => flight.arrival.iataCode
      );
    const departureDate = trip.start_date;
    const returnDate = trip.end_date;
    const adults = trip.flights[0].numberOfBookableSeats;
    this.tripsService.fetchTrips({
      flights: {
        originLocationCode,
        destinationLocationCodes: destinationLocationCodes,
        departureDate,
        returnDate,
        adults,
      },
      hotels: {
        adults: adults as number,
        cityCode: destinationLocationCodes,
        checkInDate: departureDate,
        checkOutDate: returnDate,
        imagesURI: [],
      },
    });
    this.tripsService.selectedStartDate$.next(departureDate);
    this.tripsService.selectedEndDate$.next(returnDate);
    this.tripsService.selectedNumberOfTravelers$.next(adults);
    this.tripsService.selectedCityId$.next(destinationLocationCodes[0]);
    this.tripsService.selectedHotels$ = trip.hotels;
    this.router.navigate(['/flightOptions'], {
      queryParams: { tripId: trip.id },
    });
  }

  openRemoveMembersDialog(trip: Trip): void {
    const dialogRef = this._dialog.open(EditTripMembersComponent, {
      data: trip,
    });

    dialogRef.afterClosed().subscribe((shouldRedirectToMyTrips) => {
      if (shouldRedirectToMyTrips) {
        this.router.navigate(['/myTrips']);
      }
    });
  }

  openAddMembersDialog(trip: Trip): void {
    const dialogRef = this._dialog.open(AddMembersComponent, {
      data: { userInTrip: this.usersInTrip, trip }
    });

    dialogRef.afterClosed().subscribe((shouldRedirectToMyTrips) => {
      if (shouldRedirectToMyTrips) {
        this.router.navigate(['/myTrips']);
      }
    });
  }

  planBudget(tripId: any, plannedPrices: PlannedPrice[]): void {
    const plannedPricesInput: PlannedPricesInput = {
      plannedPrices: plannedPrices,
      tripId: tripId,
    };
    this.dialog.open(PlannedPricesComponent, {
      data: plannedPricesInput,
    });
  }
}

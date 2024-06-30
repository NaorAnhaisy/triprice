import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CalculatedPrice } from 'apps/shared/models/calculatedPrices/calculatedPrice';
import { User } from 'apps/shared/models/users/user';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { FlightSearchResult } from '../../../../shared/models/flights/flightSearchResult';
import { Group } from '../../../../shared/models/groups/group';
import { UserInGroup } from '../../../../shared/models/groups/userInGroup';
import { HotelSearchResult } from '../../../../shared/models/hotels/hotelSearchResult';
import { TripSearchResult } from '../../../../shared/models/trips/tripSearchResult';
import { TripSearchRequestBody } from '../../../../shared/models/trips/tripsSearchRequestBody';
import { UserInTrip } from '../../../../shared/models/trips/userInTrip';
import { Trip } from '../../../../shared/models/trips/userTrip';
import { environment } from '../../environments/environment';
import { DialogComponent } from '../components/dialog/dialog.component';
import { AuthService } from '../services/auth.service';
import { AmadeusService } from './amadeus.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  searchLoading$ = new BehaviorSubject<boolean>(false);
  trips$ = new BehaviorSubject<TripSearchResult>({
    flights: [],
    hotels: [],
  });
  calculatedPrices$ = new BehaviorSubject<CalculatedPrice[]>([]);

  // calculatedPrices: CalculatedPrice[] = [];
  selectedOriginDestination$ = new BehaviorSubject<string>('');
  selectedFlights$: FlightSearchResult[] = [];
  selectedHotels$: HotelSearchResult[] = [];
  selectedNumberOfTravelers$ = new BehaviorSubject<number>(1);
  selectedStartDate$ = new BehaviorSubject<string>('');
  selectedEndDate$ = new BehaviorSubject<string>('');
  selectedCityId$ = new BehaviorSubject<string>('');
  selectedGroup$: Group | null;
  selectedUsersInGroup$: UserInGroup[];
  selectedCombinationDestinations$: string[] | null;
  currentShownCombinationDestionation$: string | null;
  currentCombinationDestinationIndex$: number | null;
  currentStage$ = new BehaviorSubject<number>(0);

  constructor(
    private amadeusService: AmadeusService,
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationService: AuthService
  ) {}

  async fetchTrips(flightSearchInput: TripSearchRequestBody): Promise<void> {
    this.trips$.next(await this.amadeusService.fetchTrips(flightSearchInput));
    this.findCalculatedPricesByCityId(
      this.selectedCityId$.getValue()
    ).subscribe((calculatedPrices) => {
      // this.calculatedPrices =calculatedPrices;
      this.calculatedPrices$.next(calculatedPrices);
    });
    this.searchLoading$.next(false);
  }

  resetTrips(): void {
    this.searchLoading$.next(true);
    this.trips$.next({
      flights: [],
      hotels: [],
    });
  }

  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(
      `${environment.BACKEND_URL}/trips/createGroup`,
      group
    );
  }

  insertUserInGroup(userInGroup: UserInGroup) {
    return this.http
      .post(`${environment.BACKEND_URL}/trips/insertUserInGroup`, userInGroup)
      .pipe(
        catchError((err: any) => {
          console.log('error while creating new userInTrip: ', err);
          return of(null);
        })
      )
      .subscribe((val) => {});
  }

  create(trip: Trip) {
    return this.http
      .post(`${environment.BACKEND_URL}/trips/create`, trip)
      .pipe(
        catchError((err: any) => {
          console.log('error while creating new trip: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (this.selectedGroup$) {
          const usersInTrip: UserInTrip[] = [];

          if (
            this.authenticationService.currentUserValue?.id?.toString() ===
            this.selectedGroup$?.user_id
          ) {
            this.selectedUsersInGroup$?.forEach((el) => {
              usersInTrip.push({ user_id: el.user_id, trip_id: val.id });
            });
          } else {
            usersInTrip.push({
              user_id: this.selectedGroup$?.user_id ?? '',
              trip_id: val.id,
            });
            this.selectedUsersInGroup$.forEach((el) => {
              if (
                el.user_id !==
                this.authenticationService.currentUserValue?.id?.toString()
              )
                usersInTrip.push({ user_id: el.user_id, trip_id: val.id });
            });
          }

          this.addUsersToTrip(usersInTrip, val.id);
        }

        this.openDialog(trip);
      });
  }

  remove(trip: Trip) {
    return this.http
      .post(`${environment.BACKEND_URL}/trips/remove`, trip)
      .pipe(
        catchError((err: any) => {
          console.log('error while removing trip: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          console.log('Trip deleted successfully');
          this.showSuccessNotification('Trip deleted successfully');
        }
      });
  }

  updateHotel(tripId: string, hotelId: string, hotel: HotelSearchResult) {
    const updateData = {
      tripId: tripId,
      hotelId: hotelId,
      hotel: hotel,
    };

    return this.http
      .put(`${environment.BACKEND_URL}/trips/updateHotel`, updateData)
      .pipe(
        catchError((err: any) => {
          console.log('error while updating hotel: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          console.log('Hotel updated successfully');
          this.showSuccessNotification('Hotel updated successfully');
        }
      });
  }

  updateFlight(tripId: string, flightId: string, flight: FlightSearchResult) {
    const updateData = {
      tripId: tripId,
      flightId: flightId,
      flight: flight,
    };

    return this.http
      .put(`${environment.BACKEND_URL}/trips/updateFlight`, updateData)
      .pipe(
        catchError((err: any) => {
          console.log('error while updating flight: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          console.log('Flight updated successfully');
          this.showSuccessNotification('Flight updated successfully');
        }
      });
  }

  addUsersToTrip(usersList: any, tripId: string) {
    usersList.forEach((user: UserInTrip) => {
      if (user.user_id) {
        const userInTrip: UserInTrip = {
          user_id: user.user_id,
          trip_id: tripId,
        };
        let message = '';
        this.http
          .post(`${environment.BACKEND_URL}/trips/addUserToTrip`, userInTrip)
          .pipe(
            catchError((err: any) => {
              message = 'error while creating new userInTrip';
              console.log(message + ': ', err);
              this.snackBar.open(message, 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
              return of(null);
            })
          )
          .subscribe((val) => {
            console.log(userInTrip);
            message = 'The user has been added successfully!';
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          });
      }
    });
  }

  removeUserFromTrip(userInTrip: UserInTrip) {
    this.http
      .post(`${environment.BACKEND_URL}/trips/removeUserFromTrip`, userInTrip)
      .pipe(
        catchError((err: any) => {
          console.log('error while creating new userInTrip: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.showSuccessNotification('user deleted successfully from trip');
        }
      });
  }

  inviteUserToGroup(group: Group, user: User) {
    this.http
      .post(`${environment.BACKEND_URL}/trips/inviteToGroup`, {
        group: group,
        user: user,
      })
      .pipe(
        catchError((err: any) => {
          console.log('error while inviting user to group: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.showSuccessNotification(
            'user was invited successfully to group'
          );
        }
      });
  }

  removeUserFromGroupByGroupId(groupId: string) {
    this.http
      .post(
        `${environment.BACKEND_URL}/trips/removeUserFromGroupByGroupId/${groupId}`,
        {}
      )
      .pipe(
        catchError((err: any) => {
          console.log('error while deleting user from group: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.showSuccessNotification('user deleted successfully from group');
        }
      });
  }

  removeUserFromGroupByUserId(userId: string) {
    this.http
      .post(
        `${environment.BACKEND_URL}/trips/removeUserFromGroupByUserId/${userId}`,
        {}
      )
      .pipe(
        catchError((err: any) => {
          console.log('error while deleting user from group: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.showSuccessNotification('user deleted successfully from group');
        }
      });
  }

  removeGroup(groupId: string) {
    this.http
      .post(`${environment.BACKEND_URL}/trips/removeGroup/${groupId}`, {})
      .pipe(
        catchError((err: any) => {
          console.log('error while deleting group: ', err);
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.showSuccessNotification('group deleted successfully');
        }
      });
  }

  findTripsByUserId(id: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${environment.BACKEND_URL}/trips/${id}`);
  }

  findTripsByTripId(id: string): Observable<Trip> {
    return this.http.get<Trip>(
      `${environment.BACKEND_URL}/trips/getByTripId/${id}`
    );
  }

  findCalculatedPricesByCityId(cityId: string): Observable<CalculatedPrice[]> {
    return this.http.get<CalculatedPrice[]>(
      `${environment.BACKEND_URL}/tripsCostsCalculator/cityId/${cityId}`
    );
  }

  getUsersInTrip(tripId: string): Observable<UserInTrip[]> {
    return this.http.get<UserInTrip[]>(
      `${environment.BACKEND_URL}/trips/getUsersInTrip/${tripId}`
    );
  }

  getUsersInTripByUserId(userId: string): Observable<UserInTrip[]> {
    return this.http.get<UserInTrip[]>(
      `${environment.BACKEND_URL}/trips/getUsersInTripByUserId/${userId}`
    );
  }

  openDialog(trip: Trip): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: trip,
    });

    dialogRef.afterClosed().subscribe((shouldRedirectToMyTrips) => {
      if (shouldRedirectToMyTrips) {
        this.router.navigate(['/myTrips']);
      }
    });
  }

  private showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  findGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(
      `${environment.BACKEND_URL}/trips/groupById/${id}`
    );
  }

  findGroupByUserId(user_id: string): Observable<Group[]> {
    return this.http.get<Group[]>(
      `${environment.BACKEND_URL}/trips/groupByUserId/${user_id}`
    );
  }

  findUserInGroupByUserId(user_id: string): Observable<UserInGroup[]> {
    return this.http.get<UserInGroup[]>(
      `${environment.BACKEND_URL}/trips/userInGroupByUserId/${user_id}`
    );
  }

  findUserInGroupByGroupId(group_id: string): Observable<UserInGroup[]> {
    return this.http.get<UserInGroup[]>(
      `${environment.BACKEND_URL}/trips/userInGroupByGroupId/${group_id}`
    );
  }
}

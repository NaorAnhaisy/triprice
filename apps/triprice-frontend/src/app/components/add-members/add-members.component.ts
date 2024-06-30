import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInTrip } from 'apps/shared/models/trips/userInTrip';
import { Trip } from 'apps/shared/models/trips/userTrip';
import { User } from 'apps/shared/models/users/user';
import { CategoryEnum } from '../../../../../shared/models/category/category.enum';
import { PlannedPrice } from '../../../../../shared/models/plannedPrices/plannedPrice';
import { TripService } from '../../services/trip.service';

export interface PlannedPricesInput {
  plannedPrices: PlannedPrice[];
  tripId: string;
};

@Component({
  selector: 'triprice-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss']
})
export class AddMembersComponent implements OnInit {
  categories: CategoryEnum[];
  plannedPrices: PlannedPrice[];
  newPlannedPrices: PlannedPrice[];

  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddMembersComponent>,
    private tripsService: TripService,
    @Inject(MAT_DIALOG_DATA) public data: { userInTrip: { [id: string]: User[] }, trip: Trip }
  ) {
    this.usersInTrip = data.userInTrip;
    this.trip = data.trip;
  }

  ngOnInit(): void {
    console.log(this.trip, this.usersInTrip);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  public usersInTrip: { [id: string]: User[] } = this.data.userInTrip;
  trip: Trip;
  public tripUsers = new FormControl();

  addMembersToTrip(tripId: string | undefined) {
    if (!tripId) {
      console.error('TRIP ID IS NULL WHILE ADDING MEMBERS');
      return;
    }
    this.loading = true;
    if (this.tripUsers.value && tripId) {
      const usersInTrip1: UserInTrip[] = [];
      this.tripUsers.value.forEach((val: User) => {
        usersInTrip1.push({ user_id: val.id ?? '', trip_id: tripId });
      });
      this.tripsService.addUsersToTrip(usersInTrip1, tripId);
      this.tripUsers.value.forEach((userToBeDeleted: User) => {
        this.usersInTrip[tripId] = this.usersInTrip[tripId].filter(
          (el) => el.id !== userToBeDeleted.id
        );
      });
      this.loading = false;
      this.tripUsers = new FormControl();
    } else this.loading = false;
  }
}

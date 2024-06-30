import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TripService } from '../../services/trip.service';
import { UserService } from '../../services/user.service';
import { UserInTrip } from 'apps/shared/models/trips/userInTrip';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/models/users/user';
import { Trip } from '../../../../../shared/models/trips/userTrip';

export interface DialogData {
    trip: Trip
}

@Component({
  selector: 'triprice-edit-trip-members',
  templateUrl: './edit-trip-members.component.html',
  styleUrls: ['./edit-trip-members.component.scss'],
})
export class EditTripMembersComponent {
  public usersInTrip$: Observable<UserInTrip[]>;
  public tripId: string | undefined;
  public loading = true;
  public users$: User[] = [];

    constructor(private tripsService: TripService, private userService: UserService,
        public dialogRef: MatDialogRef<EditTripMembersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Trip,
      ) {
        this.tripId = data.id;
        
        if(this.tripId)
          this.usersInTrip$ = this.tripsService.getUsersInTrip(this.tripId);
      }
    
      ngOnInit() {
        this.usersInTrip$.subscribe(val => {
          if(val) {
            val.forEach((el, i) => 
              this.userService.findUserById(el.user_id).subscribe(user => {
                this.users$.push(user);

                if(i === val.length - 1)
                  this.loading = false;
              }));
          } else {
            this.loading = false;
          }
        });
      }
    
      onDoneClick(): void {
        this.dialogRef.close(false);
      }

      removeUserFromTrip(user: User) {
        this.usersInTrip$.subscribe(val => {
          const found = val.find(element => element.user_id === user.id);
          if(found)
            this.tripsService.removeUserFromTrip(found);
        });        
        this.onDoneClick();
      }
}
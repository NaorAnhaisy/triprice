import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../../../shared/models/users/user';
import { map } from 'rxjs/operators';
import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../../../../shared/models/groups/group';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'triprice-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  public group$: Observable<Group>;
  public tripId: string;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  public groupUsers = new FormControl();
  public usersData$: Observable<User[]>;

  constructor(public dialogRef: MatDialogRef<CreateGroupComponent>,     private snackBar: MatSnackBar,
     private formBuilder: FormBuilder, private userService: UserService, private tripService: TripService, private authenticationService: AuthService,

    ) {
      this.usersData$ = this.userService.getAll().pipe(
        map(users => users.filter(x => x.id !== this.authenticationService.currentUserValue?.id?.toString()))
      );
    }

  onDoneClick(): void {
    this.dialogRef.close(false);
  }
  private showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          group_name: ['', Validators.required],
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
      
      this.group$ = this.tripService.createGroup({name: this.registerForm.value.group_name, user_id: this.authenticationService.currentUserValue?.id?.toString() ?? ''});

      this.group$.subscribe((val: any) => {
        this.groupUsers.value.forEach((el : User) => {
          if(el.id)
            this.tripService.inviteUserToGroup(val.returning[0], el);
        })
      this.onDoneClick();       
      this.showSuccessNotification('invitations to the group were sent to their emails');

      setTimeout(() => {
        window.location.reload();
      }, 1500);
      });
    }
}
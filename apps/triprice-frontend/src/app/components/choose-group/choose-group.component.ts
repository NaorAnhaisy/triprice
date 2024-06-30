import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TripService } from '../../services/trip.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../../../../shared/models/groups/group';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../../../shared/models/users/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateGroupComponent } from '../create-group/create-group.component';

export interface DialogData {
  groups: Group[];
}

@Component({
  selector: 'triprice-choose-group',
  templateUrl: './choose-group.component.html',
  styleUrls: ['./choose-group.component.scss'],
})
export class ChooseGroupComponent implements OnInit {
  public loading = true;
  public selectedGroup: Group;
  public editUsers$: User[] = [];
  public editId: string | undefined = undefined;

  constructor(
    private tripsService: TripService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ChooseGroupComponent>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Group[]
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.loading = false;
  }

  onSelectGroup(group: Group) {
    this.dialogRef.close(group);
  }

  onDoneClick(): void {
    this.dialogRef.close(false);
  }

  createGroup() {
    this._dialog.open(CreateGroupComponent);
  }

  removeGroup(groupId?: string) {
    this.tripsService.removeUserFromGroupByGroupId(groupId ?? '');
    this.tripsService.removeGroup(groupId ?? '');

    setTimeout(() => {
      window.location.reload();
    }, 2500);
  }

  editGroup(group: Group) {
    this.editUsers$ = [];
    this.loading = true;

    if (this.editId === group.id) {
      this.editId = undefined;
      this.loading = false;
    } else {
      this.editId = group.id;

      this.tripsService
        .findUserInGroupByGroupId(group.id ?? '')
        .subscribe((val) => {
          if (val) {
            val.forEach((el, i) => {
              this.userService.findUserById(el.user_id).subscribe((user) => {
                this.editUsers$.push(user);

                if (i === val.length - 1) this.loading = false;
              });
            });
          } else this.loading = false;
        });
    }
  }

  removeUserFromGroup(userId?: string) {
    this.tripsService.removeUserFromGroupByUserId(userId ?? '');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}

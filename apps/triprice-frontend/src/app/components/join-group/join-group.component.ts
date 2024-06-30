import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { CostService } from '../../services/cost.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'triprice-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss']
})

export class JoinGroupComponent {
  public loading = true;
  userId = '';
  groupId = '';

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,     private authenticationService: AuthService,
    private route: ActivatedRoute,
    private tripService: TripService, 
    private userService: UserService, 
    private costService: CostService
  ) {
  }

 
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId') ?? '';
    });

    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('groupId') ?? '';
    });

    if(this.userId && this.groupId) {
      this.tripService.insertUserInGroup({user_id: this.userId, group_id: this.groupId});
    }

    this.loading = false;
  } 
} 
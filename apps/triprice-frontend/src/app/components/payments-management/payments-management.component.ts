import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Cost } from 'apps/shared/models/costs/cost';
import { UserInTrip } from 'apps/shared/models/trips/userInTrip';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs';
import { CategoryEnum } from '../../../../../shared/models/category/category.enum';
import { Participent } from '../../../../../shared/models/payments/participent';
import { PaymentResult } from '../../../../../shared/models/payments/paymentResult';
import { User } from '../../../../../shared/models/users/user';
import { AuthService } from '../../services/auth.service';
import { CostService } from '../../services/cost.service';
import { PaymentService } from '../../services/payment.service';
import { TripService } from '../../services/trip.service';
import { UserService } from '../../services/user.service';
import { NewCostComponent, NewCostInput } from '../new-cost/new-cost.component';


@Component({
  selector: 'triprice-payments-management',
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.scss']
})

export class PaymentsManagementComponent {
  showPayments = false;
  paymentResult: PaymentResult[];
  public usersInTrip$: Observable<UserInTrip[]>;
  public users$: User[] = [];
  public tripId: string | null;
  public userId: string | null;
  public loading = true;
  public costsLoading = true;
  public categories: CategoryEnum[];
  public costs: Cost[];

  constructor(public dialog: MatDialog, private spinner: NgxSpinnerService, private authenticationService: AuthService, private paymentService: PaymentService, private route: ActivatedRoute,
    private tripsService: TripService,
    private userService: UserService,
    private costService: CostService,
    private router: Router
  ) {
    this.categories = Object.values(CategoryEnum);
    this.tripId = this.route.snapshot.paramMap.get('tripId');
    this.userId = this.route.snapshot.paramMap.get('user_id');
    if (this.userId) {
      this.userService.findUserById(this.userId).subscribe(user => {
        this.users$.push(user);
      });
    }

    if (this.tripId) {
      this.usersInTrip$ = this.tripsService.getUsersInTrip(this.tripId);
      this.costService.findCostsByTripId(this.tripId as string).subscribe(costs => {
        this.costsLoading = false;
        this.costs = costs;
      });
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.usersInTrip$.subscribe(val => {
      if (val) {
        val.forEach((el, i) =>
          this.userService.findUserById(el.user_id).subscribe(user => {
            this.users$.push(user);

            if (i === val.length - 1)
              this.loading = false;
          }));
      } else {
        this.loading = false;
      }
    });
  }

  addCost(): void {
    const newCostInput: NewCostInput = { categories: this.categories, users: this.users$, tripId: this.tripId as string }
    const dialogRef = this.dialog.open(NewCostComponent, {
      data: newCostInput,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.costService.findCostsByTripId(this.tripId as string).subscribe(costs => {
        this.costsLoading = false;
        this.costs = costs;
      });
    });
  }

  setOldParticipents(oldParticipents: Participent[]) {
    this.toggleShowResult();
  }

  toggleShowResult() {
    this.showPayments = !this.showPayments
  }

  async onSubmit() {
    const participents: Participent[] = [];
    this.users$.forEach(u => {
      participents.push({ user: u.id ? u.id : '', amount: 0 });
    });
    this.costs.forEach((cost: Cost) => {
      const user = participents.find(p => p.user === cost.user_id);
      if (user) {
        user.amount = cost.cost;
      }
      // participents.push({user: cost.user_id, amount: cost.cost})
    })
    const totalPayment = participents.reduce((accumulator, { amount }) => accumulator + +amount, 0);

    this.paymentResult = await this.paymentService.getPaymentSolution({ participents, totalPayment });
    this.toggleShowResult();
  }

  back(): void {
    this.router.navigate(['/myTrips']);
  }
} 
import { Component, Inject, Input } from '@angular/core';
import { CategoryEnum } from 'apps/shared/models/category/category.enum';
import { User } from 'apps/shared/models/users/user';
import { CostService } from '../../services/cost.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewReviewComponent } from '../new-review/new-review.component';
import { Cost } from 'apps/shared/models/costs/cost';
import { first } from 'rxjs';

export interface NewCostInput {
  categories: CategoryEnum[];
  users: User[];
  tripId: string;
};

@Component({
  selector: 'triprice-new-cost',
  templateUrl: './new-cost.component.html',
  styleUrls: ['./new-cost.component.css']
})
export class NewCostComponent {
  categories: CategoryEnum[];
  users: User[];
  tripId: string;
  costForm: FormGroup;
  loading: boolean;



  constructor( private formBuilder: FormBuilder,
    private costService: CostService,
    public dialogRef: MatDialogRef<NewReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewCostInput) {
      this.categories = data.categories;
      this.users = data.users;
      this.tripId = data.tripId;
    }

  ngOnInit() {
      this.costForm = this.formBuilder.group({
        user: '',
        cost: '',
        category: '',
        description: ''
      });
  }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    addCost(): void {
      this.loading = true;
      const cost: Cost = this.costForm.value;
      cost.trip_id = this.tripId;
      cost.user_id = this.costForm.value.user.id;
      this.costService.create(cost).pipe(first())
      .subscribe(
          data => {
            const res: any = data;
            if (res.isSucceed) {
              this.dialogRef.close();
            } else {
              this.loading = false;
            }
          },
          error => {
            this.loading = false;
          });;
    }
}

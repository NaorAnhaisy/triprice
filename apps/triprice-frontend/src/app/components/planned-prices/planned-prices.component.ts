import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryEnum } from '../../../../../shared/models/category/category.enum';
import { PlannedPrice } from '../../../../../shared/models/plannedPrices/plannedPrice';
import { PlannedPriceService } from '../../services/planned-price.service';
import { first, zip } from 'rxjs';

export interface PlannedPricesInput {
  plannedPrices: PlannedPrice[];
  tripId: string;
};

@Component({
  selector: 'triprice-planned-prices',
  templateUrl: './planned-prices.component.html',
  styleUrls: ['./planned-prices.component.scss']
})
export class PlannedPricesComponent {
  categories: CategoryEnum[];
  plannedPrices: PlannedPrice[];
  newPlannedPrices: PlannedPrice[];

  loading: boolean;

  constructor( private formBuilder: FormBuilder,
    private plannedPriceService: PlannedPriceService,
    public dialogRef: MatDialogRef<PlannedPricesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlannedPricesInput) {
      this.plannedPrices = data.plannedPrices;

      this.categories = Object.values(CategoryEnum);

      this.newPlannedPrices = this.categories.filter(category => {
        return (this.plannedPrices.find(plannedPrice => plannedPrice.category === category) == null);
      }).map(category => {
        return {
          category: category,
          price: 0,
          trip_id: data.tripId
        }
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  
    save(): void {
      this.loading = true;
      // const cost: Cost = this.costForm.value;
      // cost.trip_id = this.tripId;
      // cost.user_id = this.costForm.value.user.id;

      zip( this.plannedPriceService.updateMany(this.plannedPrices), this.plannedPriceService.createMany(this.newPlannedPrices)).pipe(first())
      .subscribe(
          data => {
            const res: any = data;
            if (res[0].isSucceed && res[1].isSucceed) {
              this.dialogRef.close();
            } else {
              this.loading = false;
            }
          },
          error => {
            this.loading = false;
          });
    }
}

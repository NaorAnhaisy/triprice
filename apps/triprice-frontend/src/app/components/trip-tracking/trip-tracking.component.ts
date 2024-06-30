import { Component, Input, OnInit } from '@angular/core';
import { Cost } from 'apps/shared/models/costs/cost';
import { PlannedPrice } from 'apps/shared/models/plannedPrices/plannedPrice';
import { CostService } from '../../services/cost.service';
import { ActivatedRoute } from '@angular/router';
import { PlannedPriceService } from '../../services/planned-price.service';
import { first, zip } from 'rxjs';
import * as _ from 'lodash';


export interface TripTrackRow {
  category: string;
  plannedCost: number;
  actualCost: number;
  percentage: string;
}


@Component({
  selector: 'triprice-trip-tracking',
  templateUrl: './trip-tracking.component.html',
  styleUrls: ['./trip-tracking.component.scss']
})
export class TripTrackingComponent implements OnInit {
  plannedPrices: PlannedPrice[];
  costs: Cost[]; 
  loading = true;

  tripTrackRows: TripTrackRow[];
  displayedColumns: string[] = ['category', 'plannedCost', 'actualCost', 'percentage'];

  constructor(private costService: CostService,private route: ActivatedRoute, private plannedPriceService:PlannedPriceService) {}

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('tripId') as string;

    zip(this.costService.findCostsByTripId(tripId),this.plannedPriceService.findPlannedPricesByTripId(tripId)).pipe(first())
    .subscribe(([costs,plannedPrices]) => {
      this.costs = costs;
      this.plannedPrices = plannedPrices;
      const sumRow: TripTrackRow = {
        category: "total",
        plannedCost: 0,
        actualCost: 0,
        percentage: '0'
      };

      this.tripTrackRows = this.plannedPrices.map(plannedPrice => {
        const costsByCategory = this.costs.filter(cost => cost.category == plannedPrice.category);
        const actualCost = _.sumBy(costsByCategory, 'cost') ?? 0;
        sumRow.actualCost += actualCost;
        sumRow.plannedCost += plannedPrice.price;

        return {
          category: plannedPrice.category,
          plannedCost: plannedPrice.price,
          actualCost: this.costs.find(cost => cost.category == plannedPrice.category)?.cost ?? 0,
          percentage: (plannedPrice.price > 0 ? ((actualCost / plannedPrice.price) * 100) : 0).toFixed(0)
        }
      });

      sumRow.percentage = ((sumRow.plannedCost > 0 ? (sumRow.actualCost / sumRow.plannedCost) : 0) * 100).toFixed(0)
      this.tripTrackRows.push(sumRow);

      this.loading = false;
    });
  }
}

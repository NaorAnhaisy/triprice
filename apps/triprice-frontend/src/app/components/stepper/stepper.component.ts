import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TripService } from '../../services/trip.service';

/**
 * @title Stepper header position
 */
@Component({
    selector: 'triprice-stepper',
    styleUrls: ['./stepper.component.scss'],
    templateUrl: './stepper.component.html',
})
export class StepperComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;

    constructor(private tripService: TripService) { }
    currentStage: number;
    prevStage: number;
    ngOnInit(): void {
        this.tripService.currentStage$.subscribe(value => {
            this.prevStage = this.currentStage;
            this.currentStage = value;

            (((this.currentStage - this.prevStage) > 0) && this.currentStage !== this.prevStage) ? this.goForward() : this.goBack();
        })
    }

    goBack() {
        if (this.stepper) {
            this.stepper.previous();
        }
    }

    goForward() {
        this.stepper.next();
    }
}

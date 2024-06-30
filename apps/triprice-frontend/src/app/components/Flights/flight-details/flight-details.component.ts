import { Component, Input, OnInit } from '@angular/core';
import { FlightDetails } from '../../../../../../shared/models/flights/flightSearchResult';

@Component({
  selector: 'triprice-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss'],
})
export class FlightDetailsComponent implements OnInit{
  @Input() flight: FlightDetails;
  @Input() return: boolean;

  ngOnInit(): void {
    console.log(this.flight);
  }
}

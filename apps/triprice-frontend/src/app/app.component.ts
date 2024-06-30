import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'triprice-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TriPrice';
  constructor(private spinner: NgxSpinnerService) {
 }

 ngOnInit() { 
   this.spinner.show();
 }
}

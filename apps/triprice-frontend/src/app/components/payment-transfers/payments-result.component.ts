import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentResult } from '../../../../../shared/models/payments/paymentResult';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'triprice-payments-result',
  templateUrl: './payments-result.component.html',
  styleUrls: ['./payments-result.component.scss'],
})
export class PaymentsResultComponent {
  @Input() dataSource: PaymentResult[];
  public computedDataSource: PaymentResult[] = [];
  public loading = true;

  public async getName(id: string): Promise<string> {
    let name: string = "";
    await this.userService.findUserById(id).subscribe(user => {
      name = user.first_name + " " + user.last_name;
    });

    return name;
  }

  @Output()
  backToPayments: EventEmitter<any> = new EventEmitter();

  constructor(private userService: UserService) {
  }

  checkIfFinishLoading(count: number) {
    if (count === this.dataSource.length * 2)
      this.loading = false;
  }

  ngOnInit() {
    let count = 0;

    console.log(this.dataSource);
    this.dataSource.forEach(el => {

      this.userService.findUserById(el.payTo).subscribe(user => {
        el.payTo = user.first_name + " " + user.last_name;
        this.checkIfFinishLoading(++count);
      });

      this.userService.findUserById(el.payFrom).subscribe(user => {
        el.payFrom = user.first_name + " " + user.last_name;
        this.checkIfFinishLoading(++count);
      });

      this.computedDataSource.push(el);
    })
  }

  displayedColumns: string[] = ['summary', "amount"];
}
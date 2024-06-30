import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentRequest } from "../../../../shared/models/payments/paymentRequest";
import { PaymentResult } from "../../../../shared/models/payments/paymentResult"
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('')
  splitPayments(@Body() body: PaymentRequest): PaymentResult[] {
    return this.paymentService.newPayment(body);
  }
}

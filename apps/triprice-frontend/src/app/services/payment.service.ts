import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { PaymentRequest } from '../../../../shared/models/payments/paymentRequest';
import { PaymentResult } from '../../../../shared/models/payments/paymentResult';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) { }

  async getPaymentSolution(payment: PaymentRequest) {
    return await firstValueFrom(this.http.post<PaymentResult[]>(`${environment.BACKEND_URL}/payments`, payment));
  }
}

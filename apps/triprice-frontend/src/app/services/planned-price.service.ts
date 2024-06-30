import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlannedPrice } from 'apps/shared/models/plannedPrices/plannedPrice';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlannedPriceService {

  constructor(private http: HttpClient) { }

  createMany(plannedPrices: PlannedPrice[]) {  
    return this.http.post(`${environment.BACKEND_URL}/plannedPrices/createMany`, plannedPrices);
  }

  updateMany(plannedPrices: PlannedPrice[]) {  
    return this.http.put(`${environment.BACKEND_URL}/plannedPrices/updateMany`, plannedPrices);
  }

  findPlannedPricesByTripId(tripId: string): Observable<PlannedPrice[]> {
    return this.http.get<PlannedPrice[]>(`${environment.BACKEND_URL}/plannedPrices/${tripId}`);
  }
}

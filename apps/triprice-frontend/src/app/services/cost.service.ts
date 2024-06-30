import { Injectable } from '@angular/core';
import { Cost } from 'apps/shared/models/costs/cost';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CostService {

  constructor(private http: HttpClient) { }

  create(cost: Cost) {  
    return this.http.post(`${environment.BACKEND_URL}/costs/create`, cost);
  }

  findCostsByTripId(tripId: string): Observable<Cost[]> {
    return this.http.get<Cost[]>(`${environment.BACKEND_URL}/costs/${tripId}`);
  }
}

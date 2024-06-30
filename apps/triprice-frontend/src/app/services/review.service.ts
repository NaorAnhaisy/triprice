import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from "../../../../shared/models/reviews/review";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient,
  ) { }

  create(review: Review) {
    return this.http.post(`${environment.BACKEND_URL}/reviews/create`, review);
  }

  update(review: Review) {
    return this.http.post(`${environment.BACKEND_URL}/reviews/update`, review);
  }

  remove(review: Review) {
    return this.http.post(`${environment.BACKEND_URL}/reviews/remove`, review);
  }

  findReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.BACKEND_URL}/reviews`);
  }
}

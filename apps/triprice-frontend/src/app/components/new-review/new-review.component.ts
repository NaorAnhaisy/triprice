import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingChangeEvent } from 'angular-star-rating';
import { Review } from 'apps/shared/models/reviews/review';
import { User } from 'apps/shared/models/users/user';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'triprice-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit {
  reviewForm: FormGroup;
  priceRating: number;
  rating: number;
  loading = false;
  user: User | null ;

  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<NewReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Review,
  ) {}

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
        city_name: ['', Validators.required],
        description: ['', Validators.required],
        title: ['', Validators.required],
    });
    if (this.data) {
      this.reviewForm.controls.city_name.setValue(this.data.city_name);
      this.reviewForm.controls.description.setValue(this.data.description);
      this.reviewForm.controls.title.setValue(this.data.title);
      this.rating = this.data.rating;
      this.priceRating = this.data.price_rating;
    }
    this.user = this.authService.currentUserValue;
}

  onNoClick(): void {
    this.dialogRef.close();
  }

  post(): void {
    this.loading = true;
    const review: Review = this.reviewForm.value;
    review.rating = this.rating;
    review.price_rating = this.priceRating;
    review.user_id = this.authService.currentUserValue?.id?.toString() ?? '';
    this.reviewService.create(review).pipe(first())
    .subscribe(
        data => {
          const res: any = data;
          if (res.isSucceed) {
            this.dialogRef.close();
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        });;
  }

  update(): void {
    this.loading = true;
    const review: Review = this.reviewForm.value;
    review.id = this.data.id;
    review.rating = this.rating;
    review.price_rating = this.priceRating;
    review.user_id = this.authService.currentUserValue?.id?.toString() ?? '';
    this.reviewService.update(review).pipe(first())
    .subscribe(
        data => {
          const res: any = data;
          if (res.isSucceed) {
            this.dialogRef.close();
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        });;
  }

  onTripRatingChange(ratingChangeEvent: RatingChangeEvent) {
    this.rating = ratingChangeEvent.rating;
  }

  onPriceRatingChange(ratingChangeEvent: RatingChangeEvent) {
    this.priceRating = ratingChangeEvent.rating;
  }
}

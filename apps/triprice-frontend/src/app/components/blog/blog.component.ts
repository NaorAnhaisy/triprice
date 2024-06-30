import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Review } from 'apps/shared/models/reviews/review';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { NewReviewComponent } from '../new-review/new-review.component';
import { ConfirmDialogComponent } from '../my-trips/dialog/dialog-my-trips.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'triprice-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  public reviews$: BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>(
    []
  );
  loading = true;
  term: string;
  public currentUserId: string;

  constructor(
    public dialog: MatDialog,
    private reviewService: ReviewService,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthService
  ) {
    this.loadReviews();
  }

  ngOnInit(): void {
      this.currentUserId = this.authenticationService.currentUserValue?.id?.toString() ?? '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewReviewComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadReviews();
    });
  }

  public loadReviews(): void {
    this.reviewService.findReviews().subscribe((reviews) => {
      this.loading = false;
      this.reviews$.next(reviews);
    });
  }

  public handleRemoveReview(review: Review): void {
    const dialogRef = this._dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Proceed with removing the review
        this.reviewService
          .remove(review)
          .pipe(
            catchError((err: any) => {
              this.snackBar.open('Error while removing review', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
              return of(null);
            })
          )
          .subscribe((val: any) => {
            if (val?.isSucceed) {
              this.loadReviews();
              this.snackBar.open('Review deleted successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
            }
          });
      }
    });
  }

  public handleEditReview(review: Review): void {
    const dialogRef = this.dialog.open(NewReviewComponent, {
      data: review,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadReviews();
    });
  }
}

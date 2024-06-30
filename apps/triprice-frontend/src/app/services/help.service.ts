import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  sendHelpEmailToTriPriceAdmin(header: string, content: string) {
    this.http
      .post(`${environment.BACKEND_URL}/help/sendHelpEmail`, {
        header,
        content,
      })
      .pipe(
        catchError((err: any) => {
          this.snackBar.open(
            'error while sending email to triPrice admin, please try again',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
          return of(null);
        })
      )
      .subscribe((val: any) => {
        if (val?.isSucceed) {
          this.snackBar.open(
            'Email sent to product team, we will contact you soon!',
            'Close',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            }
          );
          this.router.navigate(['/search']);
        }
      });
  }
}

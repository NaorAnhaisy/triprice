import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'apps/triprice-frontend/src/environments/environment';

@Component({
  selector: 'triprice-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  submitted = false;
  errorAlert = false;
  passwordErrorAlert = false;
  passwordErrorAlertMessage: string;
  emailAlert = false;
  emailAlertMessage: string;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token') ?? '';
    });
  }

  onSubmitForgotPassword(email: string) {
    this.errorAlert = false;
    if (!email) {
      this.errorAlert = true;
    }
    this.handleForgotPassword(email);
  }

  onSubmitNewPassword(newPassword: string, confirmPassword: string): void {
    if (newPassword.length < 6) {
      this.passwordErrorAlert = true;
      this.passwordErrorAlertMessage =
        'The password must be at least 6 characters long';
    } else if (newPassword !== confirmPassword) {
      this.passwordErrorAlert = true;
      this.passwordErrorAlertMessage = "The passwords doesn't match";
    } else {
      this.handleResetPassword(newPassword);
    }
  }

  back(): void {
    this.router.navigate(['/']);
  }

  public handleForgotPassword(email: string) {
    this.loading = true;
    this.errorAlert = false;
    this.emailAlertMessage = '';
    if (!email) {
      console.log('please fill email address');
      this.emailAlertMessage = 'Please fill email address';

      this.snackBar.open(this.emailAlertMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.loading = false;
      return;
    }
    const url = `${environment.BACKEND_URL}/users/forgot/${email}`;

    fetch(url, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSucceed) {
          this.emailAlertMessage = data.message + '. ' + data.subMessage;

          this.snackBar
            .open(this.emailAlertMessage, 'Close', {
              duration: 6000,
              panelClass: ['success-snackbar'],
            })
            .afterDismissed()
            .subscribe(() => {
              this.router.navigate(['/']);
            });
        } else {
          this.emailAlertMessage = 'Password reset request failed';
          this.snackBar.open(this.emailAlertMessage, 'Close', {
            duration: 10000,
            panelClass: ['error-snackbar'],
          });
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
        this.emailAlert = true;
        this.emailAlertMessage = 'The email address was not found';

        this.snackBar.open(this.emailAlertMessage, 'Close', {
          duration: 10000,
          panelClass: ['error-snackbar'],
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public handleResetPassword(password: string) {
    this.loading = true;
    this.passwordErrorAlert = false;
    this.passwordErrorAlertMessage = '';
    const url = `${environment.BACKEND_URL}/users/reset`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userNewPassword: password,
        resetToken: this.token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isSucceed) {
          this.emailAlertMessage = 'the password reset successfully!';

          this.snackBar
            .open(this.emailAlertMessage, 'Close', {
              duration: 6000,
              panelClass: ['success-snackbar'],
            })
            .afterDismissed()
            .subscribe(() => {
              this.router.navigate(['/']);
            });
        } else {
          this.emailAlertMessage = 'Password reset request failed';
          this.snackBar.open(this.emailAlertMessage, 'Close', {
            duration: 10000,
            panelClass: ['error-snackbar'],
          });
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
        this.emailAlert = true;
        this.emailAlertMessage =
          'The email address was not found or the url is invalid';

        this.snackBar.open(this.emailAlertMessage, 'Close', {
          duration: 10000,
          panelClass: ['error-snackbar'],
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

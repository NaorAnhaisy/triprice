import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ActualFileObject } from 'filepond';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'triprice-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.registerForm = this.formBuilder.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone_number: ['', [Validators.pattern('[0-9]{10}')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
        avatar: [null],
      },
      { validator: this.ConfirmedValidator('password', 'confirm_password') }
    );
  }

  ConfirmedValidator = (controlName: string, matchingControlName: string) => {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const jsonData = this.registerForm.value;
    const formData = new FormData();
    Object.keys(jsonData).forEach((key) => {
      formData.append(key, jsonData[key]);
    });

    this.loading = true;

    this.userService.register(formData).subscribe(
      (response: any) => {
        this.loading = false;
        // Check if the response contains an error
        if (response.error) {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
        } else {
          localStorage.setItem(
            'currentUser',
            JSON.stringify(response.connectedUser)
          );
          localStorage.setItem(
            'currentUserAccessToken',
            JSON.stringify(response.accessToken)
          );

          // Redirect to the home page
          this.router.navigate([this.returnUrl]);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      },
      (error) => {
        console.error('API request failed:', error);
        this.snackBar.open(
          `${error?.error?.message || 'An error occurred while signing up'}: ${
            error?.error?.error || error?.error || error?.message
          }`,
          'Close',
          {
            duration: 3000,
          }
        );
        this.loading = false;
      }
    );

    // this.userService
    //   .register(formData)
    //   .pipe(first())
    //   .subscribe(
    //     () => {
    //       this.router.navigate(['/login']);
    //     },
    //     () => {
    //       console.log("HERE")
    //       this.loading = false;
    //     }
    //   );
  }

  public onAvatarUpload(avatar: ActualFileObject) {
    this.registerForm.controls['avatar'].setValue(avatar);
  }

  get password() {
    return this.registerForm.get('password');
  }

  get phoneNumber() {
    return this.registerForm.get('phone_number');
  }

  get email() {
    return this.registerForm.get('email');
  }
}

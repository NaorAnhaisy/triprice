import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { first } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'triprice-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorAlert = false;
  returnUrl: string;
  user: any;
  provider = new FacebookAuthProvider();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const jwt = params.get('jwt');
      if (jwt) {
        console.log(jwt);
        console.log(JSON.stringify(jwt));
        localStorage.setItem('currentUserAccessToken', JSON.stringify(jwt));
        this.getUserProfile(JSON.stringify(jwt));
      }
    });

    this.provider.setCustomParameters({
      display: 'popup',
    });

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  facebookLogin() {
    const auth = getAuth();
    signInWithPopup(auth, this.provider)
      .then((result) => {
        console.log(result.user);
        const profile = {
          first_name: result.user.displayName?.split(' ')[0],
          last_name: result.user.displayName?.split(' ')[1],
          email: result.user.email,
        };

        this.authService.facebookAuth(profile);

        // need to navigate to the search page and connect it to the "CurrentLoggedInUser";
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        this.errorAlert = false;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.router.navigate([this.returnUrl]);
        this.errorAlert = true;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  }

  onSubmit() {
    this.errorAlert = false;
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe(
        (_data) => {
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 2000);
        },
        (_error) => {
          this.loading = false;
          this.errorAlert = true;
        }
      );

    this.authService.getProfile();
  }

  public navigateToForgotPassword(): void {
    this.router.navigate(['/reset']);
  }

  public loginWithGoogle(): void {
    window.location.href = `${environment.BACKEND_URL}/auth/google`;
  }

  public loginWithFacebook(): void {
    window.location.href = `${environment.BACKEND_URL}/auth/facebook`;
  }

  public getUserProfile(jwt: string) {
    if (!JSON.parse(jwt)) {
      console.log('error get user profile');
      return;
    }
    const url = `${environment.BACKEND_URL}/users/profile`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${JSON.parse(jwt)}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error retrieving user profile');
        }
        return response.json();
      })
      .then((data) => {
        console.log('User profile:', data);
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            id: data.id,
            avatar_url: data.avatar_url,
          })
        );
        location.reload();
        return data;
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  }
}

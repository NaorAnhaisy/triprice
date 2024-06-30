/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../../../../shared/models/users/user';
// import { FacebookAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenSet } from './../../../../triprice-backend/src/auth/TokenSet.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserAccessTokenSubject: BehaviorSubject<string | null>;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  public currentUserAccessToken: Observable<string | null>;

  constructor(private http: HttpClient, public afAuth: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') ?? (null as any))
    );
    this.currentUserAccessTokenSubject = new BehaviorSubject<string | null>(
      JSON.parse(
        localStorage.getItem('currentUserAccessToken') ?? (null as any)
      )
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserAccessToken =
      this.currentUserAccessTokenSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentUserAccessTokenValue(): string | null {
    return this.currentUserAccessTokenSubject.value;
  }

  async facebookAuth(profile: any) {
    return await this.http
      .post<any>(`${environment.BACKEND_URL}/auth/facebook`, {
        profile,
      })
      .pipe(tap((data) => console.log(data)))
      .subscribe((data) => {
        console.log(data);
      });
  }
  // Auth logic to run auth providers

  login(email: string, password: string) {
    return this.http
      .post<TokenSet>(`${environment.BACKEND_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((tokenSet: TokenSet) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(
            'currentUser',
            JSON.stringify(tokenSet.connectedUser)
          );
          console.log(tokenSet.accessToken);
          console.log(JSON.stringify(tokenSet.accessToken));
          localStorage.setItem(
            'currentUserAccessToken',
            JSON.stringify(tokenSet.accessToken)
          );
          this.currentUserSubject.next(tokenSet.connectedUser);
          this.currentUserAccessTokenSubject.next(tokenSet.accessToken);
          return tokenSet.accessToken;
        })
      );
  }

  logout(): void {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserAccessToken');
    this.currentUserSubject.next(null);
    this.currentUserAccessTokenSubject.next(null);
  }

  getProfile() {
    console.log(this.currentUserSubject.value);
    console.log(localStorage.getItem('currentUser'));
    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentUserSubject.value}`,
        // + JSON.parse(localStorage.getItem('currentUser'))
        // 'Bearer ' + this.currentUserSubject.value
      }),
    };

    return this.http
      .get<User>(`${environment.BACKEND_URL}/users/profile`, {
        headers: requestOptions.headers,
      })
      .pipe(
        map((user) => {
          console.log(user);
          return user;
        })
      );
  }
  //   getProfile() {
  //     return this.http.get<any>(`${environment.BACKEND_URL}/auth/profile`, {  })
  //           .pipe(map(user => {
  //               // store user details and jwt token in local storage to keep user logged in between page refreshes
  //               console.log(user);
  //               return user;
  //           }));
  //   }
}

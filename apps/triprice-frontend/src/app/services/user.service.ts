import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'apps/shared/models/users/user';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient,
    private _authService: AuthService,
    private _router: Router) {}

  getAll(): Observable<User[]>  {
    return this.http.get<User[]>(`${environment.BACKEND_URL}/users/getAllUsers`);
  }

  findUserById(user_id: string): Observable<User>  {
    return this.http.get<User>(`${environment.BACKEND_URL}/users/getById/${user_id}`);
  }

  register(user: FormData) {
    return this.http.post(`${environment.BACKEND_URL}/auth/register`, user);
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}

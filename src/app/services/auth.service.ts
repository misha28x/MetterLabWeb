import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';

import { IUser } from '../interfaces/user';
import { login, logout } from '../store/actions/permission.action';
import { catchError, filter, tap } from 'rxjs/operators';

const authUrl = 'http://165.22.83.21:3000/api/authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store<IUser>, private http: HttpClient) {}

  logIn(): void {}

  authorization(authData: { email: string; pass: string }): Observable<IUser> {
    return this.http.post(authUrl, authData).pipe(
      filter(val => !!val),
      tap(res => this.store.dispatch(login(res))),
      catchError(this.handleAuthError)
    );
  }

  logOut(): void {
    localStorage.clear();
    this.store.dispatch(logout());
  }

  handleAuthError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(error.error);
  }
}

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IUser } from '../interfaces/user';
import { logout } from '../store/actions/permission.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store<IUser>) {}

  logIn(): void {}

  logOut(): void {
    localStorage.clear();
    this.store.dispatch(logout());
  }
}

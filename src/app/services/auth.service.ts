import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../interfaces/user';
import { logout, login } from '../store/actions/permission.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: Store<User>) { }

  logIn(): void {

  }

  logOut(): void {
    localStorage.clear();
    this.store.dispatch(logout());
  }
}

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: Store<string>) { }

  setpermission(): void {
    
  }
}

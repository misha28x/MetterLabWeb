import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(window.localStorage.getItem('user'));

    if (!user) {
      this.router.navigate(['']);
      return  false;
    }

    return true;
  }
}

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { User } from './interfaces/user';
import { login } from './store/actions/permission.action';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store<User>, private localeService: BsLocaleService) {
    this.localeService.use('ru');
    if (window.localStorage.getItem('time')) {
      const addingTime = parseInt(window.localStorage.getItem('time'), 10);
      const currentTime = new Date().getTime();

      if ((currentTime - addingTime) / 1000 < 900) {
        const user = JSON.parse(window.localStorage.getItem('user'));
        this.store.dispatch(login(user));
      } else {
        window.localStorage.clear();
      }
    }
  }
}

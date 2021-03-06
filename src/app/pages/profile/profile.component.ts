import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.scss',
    '../../ui/components/add-employee/add-employee.component.scss'
  ]
})
export class ProfileComponent {
  user: any;
  constructor(private store: Store<IUser>, private http: HttpClient) {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.http
        .get('http://165.22.83.21:3000/api/employees/user/' + _user.userId)
        .subscribe(res => {
          this.user = res[0];
        });
    });
  }
}

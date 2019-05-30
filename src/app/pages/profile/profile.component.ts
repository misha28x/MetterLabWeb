import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { User } from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../ui/components/add-employee/add-employee.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  constructor(
    private store: Store<User>,
    private http: HttpClient
  ) {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.http.get('http://134.209.243.90:3000/api/employees/user/' + _user.userId).subscribe(res => {
        this.user = res[0];
        console.log(res);
      });
    });
  }

  ngOnInit() { }

}

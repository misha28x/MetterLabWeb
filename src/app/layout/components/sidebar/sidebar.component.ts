import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { IUser } from '../../../interfaces/user';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @HostBinding('class.sidebar') true;
  @HostBinding('class.min') @Input() min: Boolean;
  @HostBinding('class.open') get getMenuState(): boolean {
    return !this.min;
  }

  user: IUser;

  constructor(public authSv: AuthService, private store: Store<IUser>) {}

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
    });
  }

  getUserName(username: string): string {
    const [last, first] = username.split(' ');
    return `${last} ${!!first ? first : ''}`;
  }

  logOut(): void {
    this.authSv.logOut();
  }
}

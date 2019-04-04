import { Component, OnInit, HostBinding, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { User } from '../../../interfaces/user';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	@HostBinding('class.sidebar') true;
	@HostBinding('class.min') @Input() min: Boolean;
  @HostBinding('class.open') get getMenuState(): boolean { return !this.min; }

  user: User;

  constructor(
    public authSv: AuthService,
    private store: Store<User>
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
      console.log(_user);
    });
  }

  logOut(): void {
    this.authSv.logOut();
  }
}

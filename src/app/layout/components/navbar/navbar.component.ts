import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as MenuActions from '../../../store/actions/menu.actions';
import { MenuService } from '../../../services/menu.service';
import { SourceService } from '../../../services/source.service';
import { IUser } from '../../../interfaces/user';
import { changePermission } from '../../../store/actions/permission.action';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.header') true;

  user: IUser;
  menuState: Boolean;
  permission: number;
  options: any[];
  visit: any;

  constructor(
    public router: Router,
    private menuSv: MenuService,
    private store: Store<Boolean>
  ) {}

  ngOnInit(): void {
    this.store.select('menuState').subscribe((menuState: Boolean) => {
      this.menuState = menuState;
    });

    this.store.select('permission').subscribe(user => {
      this.permission = user.permission;
      this.user = user;
    });

    this.menuSv.getVisitState().subscribe(state => {
      this.visit = state;
    });
  }

  onButtonClick(): void {
    this.menuState = !this.menuState;
    this.menuState
      ? this.store.dispatch(new MenuActions.Open())
      : this.store.dispatch(new MenuActions.Close());
  }

  changeMetrology(data: Pick<IUser, 'permission' | 'createFor'>): void {
    this.store.dispatch(changePermission(data));
  }
}

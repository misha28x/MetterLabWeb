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
  selectedValue: any[];

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

    this.options = [
      {
        permission: 5,
        createFor: 91444871,
        serviceProvider: 91444871,
        title: `ТзОВ "ВОЛИНЬ АКВА СТАНДАРТ"`
      },
      {
        permission: 3,
        createFor: 111,
        serviceProvider: 111,
        title: ` ДП "Волиньстандартметрологія"`
      }
    ];

    this.selectedValue = this.options[0];
  }

  onButtonClick(): void {
    this.menuState = !this.menuState;
    this.menuState
      ? this.store.dispatch(new MenuActions.Open())
      : this.store.dispatch(new MenuActions.Close());
  }

  changeMetrology(
    data: Pick<IUser, 'permission' | 'createFor' | 'serviceProvider'>
  ): void {
    this.store.dispatch(changePermission(data));
  }
}

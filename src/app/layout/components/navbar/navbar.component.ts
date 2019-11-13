import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as MenuActions from '../../../store/actions/menu.actions';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.header') true;

  @Input() pageTitle: String;
  menuState: Boolean;
  permission: number;

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
    });
  }

  onButtonClick(): void {
    this.menuState = !this.menuState;
    this.menuState
      ? this.store.dispatch(new MenuActions.Open())
      : this.store.dispatch(new MenuActions.Close());
  }
}

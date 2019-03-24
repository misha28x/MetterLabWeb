import { Component, OnInit, HostBinding } from '@angular/core';
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
  
	pageTitle: String;
  menuState: Boolean;
  permission: number;
  visit: any;

	constructor(
			private menuSv: MenuService,
			private store: Store<Boolean>) { }

  ngOnInit(): void {
		this.store.select('menuState').subscribe((menuState: Boolean) => {
			this.menuState = menuState;
    });
    
    this.store.select('permission').subscribe(user => {
      this.permission = user.permission;
    });

    this.menuSv.getVisitState().subscribe(state => {
      this.visit = state;
    });
	}

	onButtonClick(): void {
		this.menuState = !this.menuState;
		this.menuState ?
			this.store.dispatch(new MenuActions.Open()) :
			this.store.dispatch(new MenuActions.Close());
  }

  cancelVisit(): void {
    this.menuSv.cancelVisit();
  }
}

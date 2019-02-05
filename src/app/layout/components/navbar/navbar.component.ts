import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import * as MenuActions from '../../../store/actions/menu.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @HostBinding('class.header') true;
  
	pageTitle: String;
	menuState: Boolean;

	constructor(
			private router: Router,
			private activeRoute: ActivatedRoute,
			private store: Store<Boolean>) { }

  ngOnInit(): void {
		this.store.select('menuState').subscribe((menuState: Boolean) => {
			this.menuState = menuState;
		});
		this.pageTitle = this.activeRoute.firstChild.data['value']['title'];
		this.getPageTitle();
	}

	onButtonClick(): void {
		this.menuState = !this.menuState;
		this.menuState ?
			this.store.dispatch(new MenuActions.Open()) :
			this.store.dispatch(new MenuActions.Close());
	}

	getPageTitle(): void {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => {
				let child = this.activeRoute.firstChild;
				while (child) {
					if (child.firstChild) {
						child = child.firstChild;
					} else if (child.snapshot && child.snapshot.data['title']) {
						return child.snapshot.data['title'];
					} else {
						return null;
					}
				}
			}) 
		).subscribe((pageTitle: any) => {
			this.pageTitle = pageTitle;
		});
	}
}

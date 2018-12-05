import { Component, OnInit, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';

import * as MenuActions from '../../store/actions/menu.actions';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss']
})
export class DefaultLayoutComponent implements OnInit{
	minMenu: Boolean;

	constructor(private store: Store<Boolean>) { }

	ngOnInit(): void {
		this.onResize();
		this.store.select('menuState').subscribe((menuState: Boolean) => {
			this.minMenu = !menuState;
		});
	}

	@HostListener('window:resize', ['$event'])
	public onResize(): void {
		if (window.innerWidth < 991) {
			this.store.dispatch(new MenuActions.Close());
		} else {
			this.store.dispatch(new MenuActions.Open());
		}

	}
}

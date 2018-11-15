import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss']
})
export class DefaultLayoutComponent implements OnInit{
	minMenu: Boolean;

	constructor(private store: Store<Boolean>) { }

	ngOnInit(): void {
		this.store.select('menuState').subscribe((menuState: Boolean) => {
			this.minMenu = menuState;
		});
	}
}

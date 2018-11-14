import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../services/data.service';
import { IMenuItem } from '../../../interfaces/menu';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	menu: IMenuItem[];
	url: string;

	constructor(private dataSv: DataService) { }

	ngOnInit(): void {
		this.url = '../../../../assets/data/menu.json';
		this.getMenuItems(this.url);
	}

	getMenuItems(url: string): void {
		const observer = {
			next: x => this.menu = x,
			error: err => this.dataSv.handleError(err)
		};

		this.dataSv.getData(url).subscribe(observer);
	}
}

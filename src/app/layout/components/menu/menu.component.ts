import { Component, OnInit, HostBinding, Input } from '@angular/core';

import { DataService } from '../../../services/data.service';
import { IMenuItem } from '../../../interfaces/menu';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	@HostBinding('class.main-menu') true;
	@HostBinding('class.min') @Input() min: Boolean;

	menu: IMenuItem[];
	url: string;

	constructor(private dataSv: DataService) { }

	ngOnInit(): void {
		this.url = 'http://localhost:3000/api/menu';
		this.getMenuItems(this.url);
	}

	getMenuItems(url: string): void {
		const observer = {
			next: x => this.menu = x,
			error: err => this.dataSv.handleError(err),
      complete: () => console.log(this.menu)
		};

		this.dataSv.getData(url).subscribe(observer);
	}
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

const url = 'http://134.209.243.90:3000/api/brigade-tasks';

@Component({
	selector: 'app-brigade-tasks',
	templateUrl: './brigade-tasks.component.html',
	styleUrls: ['./brigade-tasks.component.scss']
})
export class PageBrigadeTasksComponent implements OnInit {

	brigadeTasks: Observable<any[]>;

	constructor(private dataSv: DataService) { }

	ngOnInit(): void {
		this.brigadeTasks = this.dataSv.getData(url);
	}
}

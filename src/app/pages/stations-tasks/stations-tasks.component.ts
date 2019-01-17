import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { TaskListEditDialogComponent } from './task-list-edit-dialog/task-list-edit-dialog.component';
import { TaslListViewDialogComponent } from './tasl-list-view-dialog/tasl-list-view-dialog.component';

const url = 'http://localhost:3000/api/stations-tasks';

@Component({
	selector: 'app-stations-tasks',
	templateUrl: './stations-tasks.component.html',
	styleUrls: ['./stations-tasks.component.scss']
})
export class PageStationsTasksComponent implements OnInit {

	stationsTasks: Observable<any[]>;

	constructor(private dataSv: DataService, private dialog: MatDialog) { }

	ngOnInit(): void {
		this.stationsTasks = this.dataSv.getData(url);
	}

	editList(id: number): void {
		this.dialog.open(TaskListEditDialogComponent, { data: id });
	}

	viewList(id: number): void {
		this.dialog.open(TaslListViewDialogComponent, { data: id });
	}

	downloadExcel(id: number): void {
		this.dataSv.getData(url + '/excel/' + id).subscribe(
			next => {
				console.log(next);
			}
		);
	}
}

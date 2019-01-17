import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-task-list-edit-dialog',
  templateUrl: './task-list-edit-dialog.component.html',
  styleUrls: ['./task-list-edit-dialog.component.scss']
})
export class TaskListEditDialogComponent implements OnInit {

	taskList: Observable<any[]>;
	private url: string;

	constructor(private dataSv: DataService) { }

	ngOnInit(): void {
		this.url = 'http://localhost:3000/api/station-tasks';

		this.taskList = this.dataSv.getData(this.url);
	}
}

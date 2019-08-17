import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataService } from '../../../services/data.service';

@Component({
	selector: 'app-task-list-edit-dialog',
	templateUrl: './task-list-edit-dialog.component.html',
	styleUrls: ['./task-list-edit-dialog.component.scss']
})
export class TaskListEditDialogComponent implements OnInit {

	taskList: Observable<any[]>;
	private url: string;

	constructor(
		private dataSv: DataService,
		private dialogRef: MatDialogRef<TaskListEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public idTask: number) { }

	ngOnInit(): void {
    this.url = 'http://localhost:3000/api/stations-tasks/tasks/' + this.idTask;

    this.taskList = this.dataSv.getData(this.url);
	}
}

import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';

import { DataService } from '../../../services/data.service';

@Component({
	selector: 'app-tasl-list-view-dialog',
	templateUrl: './tasl-list-view-dialog.component.html',
	styleUrls: ['./tasl-list-view-dialog.component.scss']
})
export class TaslListViewDialogComponent implements OnInit {

	taskList: Observable<any[]>;
	private url: string;

	constructor(
		private dataSv: DataService,
		private dialogRef: MatDialogRef<TaslListViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public idTask: number
	) { }

	ngOnInit(): void {
		this.url = 'http://localhost:3000/api/stations-tasks/' + this.idTask;

		this.taskList = this.dataSv.getData(this.url);
	}
}

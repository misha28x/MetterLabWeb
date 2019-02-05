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

  cancelTask(id: string): void {
    this.dataSv.getData('http://localhost:3000/api/stations-tasks/delete/' + id).subscribe();
  }
  rejectVerification(id: string): void {
    this.dataSv.getData('http://localhost:3000/api/new-verification/rejected/:id' + id).subscribe();
  }
  
  rowStyle(date: string, status: string): any {
    return {
      'table-error': this.isFailed(date, status),
      'table-success': !this.isFailed(date, status)
    };
  } 

  isFailed(date: string, status: string): boolean {
    if (new Date(date) > new Date || status.includes('Проведено повірку')) {
      return false;
    }
    return true;
  }
}

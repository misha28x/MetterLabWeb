import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TaslListViewDialogComponent } from './tasl-list-view-dialog/tasl-list-view-dialog.component';

@Component({
  selector: 'app-task-list-view',
  templateUrl: './task-list-view.component.html',
  styleUrls: ['./task-list-view.component.scss']
})
export class TaskListViewComponent implements OnInit {

	constructor(private matDialog: MatDialog) { }

	ngOnInit(): void {
  }

	openDialg(): void {
		this.matDialog.open(TaslListViewDialogComponent, {
			height: '98%',
			width: '98vw',
			panelClass: 'full-screen-modal'
		});
	}
}

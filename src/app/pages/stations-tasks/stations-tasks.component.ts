import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { TaskListEditDialogComponent } from './task-list-edit-dialog/task-list-edit-dialog.component';
import { TaslListViewDialogComponent } from './tasl-list-view-dialog/tasl-list-view-dialog.component';

const url = 'http://localhost:3000/api/stations-tasks';
const sendUrl = 'http://localhost:3000/api/file-sending/';

@Component({
	selector: 'app-stations-tasks',
	templateUrl: './stations-tasks.component.html',
	styleUrls: ['./stations-tasks.component.scss']
})
export class PageStationsTasksComponent implements OnInit {

	stationsTasks: Observable<any[]>;
  selectedData: any[];

	constructor(
    private sourceSv: SourceService,
    private snackBar: MatSnackBar,
    private dataSv: DataService,
    private dialog: MatDialog
    ) { }

	ngOnInit(): void {
    this.sourceSv.fetchStationTasks();
    this.stationsTasks = this.sourceSv.getStationTasks();
    this.selectedData = [];
	}

	editList(id: number): void {
		this.dialog.open(TaskListEditDialogComponent, { data: id });
	}

	viewList(id: number): void {
		this.dialog.open(TaslListViewDialogComponent, { data: id });
	}

	downloadExcel(id: number): void {
    this.dataSv.getFile(url + '/excel/' + id);
	}

  sendData(): void {
    const observer = {
      next: x => console.log(x),
      error: err => this.dataSv.handleError(err),
      complete: () => this.showSnackBar()
    };
    console.log(sendUrl + this.selectedData[0].id_task);
    const task = forkJoin(
      this.selectedData.map( message => this.dataSv.sendData(sendUrl + message.id))
    );
    
    task.subscribe(observer);
  }

  showSnackBar(): void {
    this.snackBar.open('Завдання надіслано', 'Закрити', {
      duration: 2000
    });
  }

  onChange(data: any, state: boolean): void {
    this.selectedData = data;
    console.log(data);
  }
}

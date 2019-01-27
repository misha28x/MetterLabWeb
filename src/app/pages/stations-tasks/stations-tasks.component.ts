import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';

import { DataService } from '../../services/data.service';
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
    private snackBar: MatSnackBar,
    private dataSv: DataService,
    private dialog: MatDialog
    ) { }

	ngOnInit(): void {
		this.stationsTasks = this.dataSv.getData(url);
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

    const task = forkJoin(
      this.selectedData.map( id => this.dataSv.sendData(sendUrl + id))
    );
    
    task.subscribe(observer);
  }

  showSnackBar(): void {
    this.snackBar.open('Завдання надіслано', 'Закрити', {
      duration: 2000
    });
  }

  onChange(data: any, state: boolean): void {
    if (state) {
      this.selectedData.push(data);
    } else {
      this.selectedData = this.selectedData.filter(
        (val: any) => {
          return val !== data;
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';

import { SourceService } from '../../services/source.service';
import { DataService } from '../../services/data.service';
import { TaskListEditDialogComponent } from '../stations-tasks/task-list-edit-dialog/task-list-edit-dialog.component';
import { TaslListViewDialogComponent } from '../stations-tasks/tasl-list-view-dialog/tasl-list-view-dialog.component';

const url = 'http://165.22.83.21:3000/api/stations-tasks/failed/1';
const sendUrl = 'http://165.22.83.21:3000/api/file-sending/';

@Component({
  selector: 'app-failed-tasks',
  templateUrl: './failed-tasks.component.html',
  styleUrls: ['./failed-tasks.component.scss']
})
export class FailedTasksComponent implements OnInit {

  stationsTasks: Observable<any[]>;
  selectedData: any[];

  constructor(
    private sourceSv: SourceService,
    private snackBar: MatSnackBar,
    private dataSv: DataService,
    private dialog: MatDialog
  ) {
    this.sourceSv.fetchFailedTasks();
    this.stationsTasks = this.sourceSv.getFailedTasks();
  }

  ngOnInit(): void {
    this.selectedData = [];
  }

  editList(id: number): void {
    this.dialog.open(TaskListEditDialogComponent, { data: id });
  }

  viewList(id: number): void {
    this.dialog.open(TaslListViewDialogComponent, { data: { taskId: id, unresolved: true } });
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
      this.selectedData.map(id => this.dataSv.sendData(sendUrl + id))
    );

    task.subscribe(observer);
  }

  showSnackBar(): void {
    this.snackBar.open('Завдання надіслано', 'Закрити', {
      duration: 2000
    });
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

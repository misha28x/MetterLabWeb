import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { SourceService } from '../../services/source.service';
import { StationsService } from '../../services/stations.service';

@Component({
  selector: 'app-stations-tasks',
  templateUrl: './stations-tasks.component.html',
  styleUrls: ['./stations-tasks.component.scss']
})
export class PageStationsTasksComponent implements OnInit {
  stationsTasks: Observable<any[]>;
  selectedData: any[];

  constructor(
    private stationSv: StationsService,
    private sourceSv: SourceService,
    private snackBar: MatSnackBar,
    private taskSv: TaskService
  ) {}

  ngOnInit(): void {
    this.updateList();
    this.stationsTasks = this.sourceSv.getStationTasks();
    this.selectedData = [];
  }

  viewList(id: string): void {
    this.taskSv.viewList(id);
  }

  changeDate(id: string, date: string): void {
    this.taskSv.changeTaskDate(id, date).subscribe(() => this.updateList());
  }

  downloadExcel(id: string): void {
    this.taskSv.downloadExcel(id);
  }

  sendData(): void {
    if (!this.selectedData.length) {
      return;
    }

    const observer = {
      next: () => this.sourceSv.fetchStationTasks(),
      error: err => this.showSnackBar(err),
      complete: () => this.showSnackBar()
    };

    this.taskSv.sendTasks(this.selectedData).subscribe(observer);
  }

  disbandTask(id: string): void {
    this.taskSv.disbandTask(id).subscribe(() => this.updateList);
  }

  changeStationNumber(taskId: string, stationNumber: string): void {
    this.stationSv
      .changeStation(taskId, stationNumber)
      .subscribe(() => this.sourceSv.fetchStationTasks());
  }

  showSnackBar(msg: string = 'Завдання надіслано'): void {
    this.snackBar.open(msg, 'Закрити', {
      duration: 2000
    });
  }

  onChange(data: any): void {
    this.selectedData = data;
  }

  updateList(): void {
    this.sourceSv.fetchStationTasks();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { SourceService } from '../../services/source.service';
import { StationsService } from '../../services/stations.service';
import { map } from 'rxjs/operators';
import { Task, TaskStatuses } from '../../interfaces/taskData';

@Component({
  selector: 'app-stations-tasks',
  templateUrl: './stations-tasks.component.html',
  styleUrls: ['./stations-tasks.component.scss']
})
export class PageStationsTasksComponent implements OnInit {
  stationsTasks: Observable<any[]>;
  selectedData: any[];

  taskStatuses: typeof TaskStatuses;
  selectedStatus: TaskStatuses;

  infoStatus: TaskStatuses;
  errorStatus: TaskStatuses;
  successStatus: TaskStatuses;

  constructor(
    private stationSv: StationsService,
    private sourceSv: SourceService,
    private snackBar: MatSnackBar,
    private taskSv: TaskService
  ) {
    this.updateList();
  }

  ngOnInit(): void {
    this.selectedStatus = TaskStatuses.New;
    this.taskStatuses = TaskStatuses;

    this.stationsTasks = this.sourceSv
      .getStationTasks()
      .pipe(map(tasks => tasks.filter(task => task.task_status.length < 2)));
  }

  filterTasks(status: TaskStatuses): void {
    this.updateList();

    this.errorStatus = null;
    this.infoStatus = null;
    this.successStatus = null;

    switch (status) {
      case TaskStatuses.Failed:
        this.stationsTasks = this.sourceSv.getFailedTasks();
        break;

      case TaskStatuses.New:
        this.stationsTasks = this.sourceSv
          .getStationTasks()
          .pipe(map(tasks => tasks.filter(task => task.task_status.length < 2)));
        break;

      case TaskStatuses.Resolved:
      case TaskStatuses.Send:
        this.stationsTasks = this.sourceSv
          .getStationTasks()
          .pipe(map(tasks => tasks.filter(this.filterTaskByStatus(status))));
        break;

      case TaskStatuses.Uploaded:
        this.stationsTasks = this.sourceSv.getStationTasks().pipe(
          map((tasks: Task[]) => {
            const isResolved = (task: Task) =>
              task.task_status === TaskStatuses.Failed ||
              task.task_status === TaskStatuses.Resolved;
            return tasks.filter(isResolved);
          })
        );
        break;

      default:
      case TaskStatuses.All:
        this.errorStatus = TaskStatuses.Failed;
        this.infoStatus = TaskStatuses.Uploaded;
        this.successStatus = TaskStatuses.Send;

        this.stationsTasks = this.sourceSv.getStationTasks();
    }
  }

  filterTaskByStatus(status: TaskStatuses): (task: Task) => boolean {
    return (task: Task) => {
      return task.task_status === status;
    };
  }

  viewList(id: string): void {
    this.taskSv.viewList(id).subscribe(() => this.updateList());
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
    this.taskSv.disbandTask(id).subscribe(() => {
      this.updateList();
    });
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
    this.sourceSv.fetchFailedTasks();
    this.selectedData = [];
  }
}

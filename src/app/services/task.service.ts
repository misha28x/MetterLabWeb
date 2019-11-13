import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { filter, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

import { StationTask } from '../interfaces/task';
import { TaslListViewDialogComponent } from '../pages/stations-tasks/tasl-list-view-dialog/tasl-list-view-dialog.component';
import { DeleteDialogComponent } from '../ui/components/delete-dialog';
import { ChangeTaskDateComponent } from '../ui/components/change-task-date';

const taskUrl = 'http://165.22.83.21:3000/api/stations-tasks';
const sendUrl = 'http://165.22.83.21:3000/api/file-sending';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private dialog: MatDialog, private http: HttpClient) {}

  viewList(id: string, unresolved: boolean = false): Observable<void> {
    const ref = this.dialog.open(TaslListViewDialogComponent, {
      data: { taskId: id, unresolved },
      width: '100%',
      height: '100%',
      panelClass: 'full-screen-modal'
    });

    return ref.afterClosed();
  }

  downloadExcel(id: string): void {
    window.open(`${taskUrl}/excel/${id}`);
  }

  changeTaskDate(id: string, date: string): Observable<any> {
    return this.dialog
      .open(ChangeTaskDateComponent, {
        data: date
      })
      .afterClosed()
      .pipe(
        filter(val => !!val),
        switchMap(newDate =>
          this.http.put(`${taskUrl}/task/change-date/${id}`, { newDate })
        )
      );
  }

  disbandTask(id: string): Observable<any> {
    return this.dialog
      .open(DeleteDialogComponent, { minWidth: '600px', data: 'завдання' })
      .afterClosed()
      .pipe(
        filter(val => !!val),
        switchMap(() => this.http.delete(`${taskUrl}/${id}`))
      );
  }

  sendTasks(tasks: StationTask[]): Observable<any> {
    return forkJoin(
      tasks.map(task =>
        this.http.post(sendUrl, { id: task.id_task, status: task.task_status })
      )
    );
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs';

import { Task } from '../../../interfaces/taskData';

@Component({
  selector: 'app-task-sending',
  templateUrl: './task-sending.component.html',
  styleUrls: ['./task-sending.component.scss']
})
export class TaskSendingComponent implements OnInit {
  selectedService: string;
  selectedDate: string;
  selectedStation: string;

  constructor(
    private dialogRef: MatDialogRef<TaskSendingComponent>,
    @Inject(MAT_DIALOG_DATA) public stations: Observable<string[]>
    ) { }

  ngOnInit(): void { }

  saveData(): void {
    const date = new Date(this.selectedDate);
    const data: Task = {
      stationNumber: this.selectedStation,
      serviceType: this.selectedService,
      taskDate: date.toISOString()
    };

    this.dialogRef.close(data);
  }
}

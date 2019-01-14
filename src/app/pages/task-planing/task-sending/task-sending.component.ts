import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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

  constructor(private dialogRef: MatDialogRef<TaskSendingComponent>) { }

  ngOnInit(): void { }

  saveData(): void {
    const data: Task = {
      stationNumber: this.selectedStation,
      serviceType: this.selectedService,
      taskDate: this.selectedDate
    };

    this.dialogRef.close(data);
  }

}

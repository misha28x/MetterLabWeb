import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
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

  constructor(
    private dialogRef: MatDialogRef<TaskSendingComponent>,
    @Inject(MAT_DIALOG_DATA) public stations: string[]
    ) { }

  ngOnInit(): void { }

  saveData(): void {
    const date = this.selectedDate;
    const data: Task = {
      stationNumber: this.selectedStation,
      serviceType: this.selectedService,
      taskDate: date
    };

    this.dialogRef.close(data);
  }
}

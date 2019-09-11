import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-task-date',
  templateUrl: './change-task-date.component.html',
  styleUrls: ['./change-task-date.component.scss']
})
export class ChangeTaskDateComponent implements OnInit {
  newDate: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public oldDate: Date,
    private dialogRef: MatDialogRef<ChangeTaskDateComponent>
  ) {}

  ngOnInit(): void {
    this.newDate = new Date(this.oldDate);
  }

  closeDialog(): void {
    const dateString = `${this.newDate.getFullYear()}-${this.newDate.getMonth() +
      1}-${this.newDate.getDate()}`;
    this.dialogRef.close(dateString);
  }

  setDate(date: Date): void {
    this.newDate = date;
  }
}

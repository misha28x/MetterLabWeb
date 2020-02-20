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
    const dateString = this.getDateString(this.newDate);
    this.dialogRef.close(dateString);
  }

  setDate(date: Date): void {
    this.newDate = date;
  }

  getDateString(d: Date): string {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
  }
}

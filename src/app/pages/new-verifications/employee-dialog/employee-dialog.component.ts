import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss']
})
export class EmployeeDialogComponent implements OnInit {
  selectedValue: string;

  constructor(private dialogRef: MatDialogRef<EmployeeDialogComponent>) { }

  ngOnInit(): void { }

  save(): void {
    this.dialogRef.close(this.selectedValue);
  }
}

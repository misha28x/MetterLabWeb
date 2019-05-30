import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-seal-edit',
  templateUrl: './seal-edit.component.html',
  styleUrls: ['./seal-edit.component.scss']
})
export class SealEditComponent implements OnInit {
  comment: any;
  selectedDate: any;
  selectedNumber: any;

  constructor(
    private dialogRef: MatDialogRef<SealEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    const data = {
      comment: this.comment,
      date: this.selectedDate,
      number: this.selectedNumber
    };

    this.dialogRef.close(data);
  }
}

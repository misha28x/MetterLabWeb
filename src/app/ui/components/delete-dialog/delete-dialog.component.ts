import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {
  title: string;
  msg: string;
  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; msg: string }
  ) {}

  ngOnInit() {
    const { msg = '', title = 'Видалення' } = this.data;
    this.title = title;
    this.msg = msg;
  }

  delete(): void {
    this.dialogRef.close('delete');
  }
}

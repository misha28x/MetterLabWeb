import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-end-state-dialog',
  templateUrl: './end-state-dialog.component.html',
  styleUrls: ['./end-state-dialog.component.scss']
})
export class EndStateDialogComponent implements OnInit {

  state: FormControl;

  constructor(
    private dialogRef: MatDialogRef<EndStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.state = new FormControl(this.data.value);
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.base64Data.toString();
  }

  saveState(): void {
    this.dialogRef.close(this.state.value);
  }
}

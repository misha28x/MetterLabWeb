import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { PhotoOrientationService } from '../../../../services/photo-orientation.service';

@Component({
  selector: 'app-start-state-dialog',
  templateUrl: './start-state-dialog.component.html',
  styleUrls: ['./start-state-dialog.component.scss']
})
export class StartStateDialogComponent implements OnInit {

  state: FormControl;
  angle: number;

  constructor(
    private dialogRef: MatDialogRef<StartStateDialogComponent>,
    private photoSv: PhotoOrientationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.state = new FormControl(this.data.value);
    this.angle = this.photoSv.getAngle();
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.base64Data.toString();
  }

  saveState(): void {
    this.dialogRef.close(this.state.value);
  }

  cancelChanges(): void {
    this.dialogRef.close(this.data.value);
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TestService } from '../../../../services/test.service';

@Component({
  selector: 'app-start-state-dialog',
  templateUrl: './start-state-dialog.component.html',
  styleUrls: ['./start-state-dialog.component.scss']
})
export class StartStateDialogComponent implements OnInit {

  state: FormControl;

  constructor(
    private dialogRef: MatDialogRef<StartStateDialogComponent>,
    private testSv: TestService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.state = new FormControl(this.data.value);
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.base64Data.toString();
  }

  saveState(): void {
    this.testSv.updateStartState(this.data.test, this.state.value);
    this.dialogRef.close();
  }
}

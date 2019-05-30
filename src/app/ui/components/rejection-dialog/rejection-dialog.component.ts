import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-rejection-dialog',
  templateUrl: './rejection-dialog.component.html',
  styleUrls: ['./rejection-dialog.component.scss']
})
export class RejectionDialogComponent implements OnInit {
  list: any;
  selectedType: string;

  constructor(
    private dataSv: DataService,
    private dialogRef: MatDialogRef<RejectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedType = '';
    this.list = this.dataSv.getData('http://134.209.243.90:3000/api/rejected-verification/types/rejections');
    this.list.subscribe(console.log);
  }

  ngOnInit() {
  }

  save(): void {

  }
}

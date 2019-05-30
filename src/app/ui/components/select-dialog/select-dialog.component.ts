import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent implements OnInit {
  selectedType: any;
  selectedProvider: any;

  constructor(
    private dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedType = this.data.type || '';
    this.selectedProvider = this.data.provider || '';
  }

  ngOnInit(): void {
  }

  save(): void {
    const data = {
      type: this.selectedType,
      provider: this.selectedProvider
    };
    
    this.dialogRef.close(data);
  }
}

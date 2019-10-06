import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-rejection-dialog',
  templateUrl: './rejection-dialog.component.html',
  styleUrls: ['./rejection-dialog.component.scss']
})
export class RejectionDialogComponent {
  list$: any;
  selectedType: string;

  constructor(private dataSv: DataService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedType = '';
    this.list$ = this.dataSv.getData(
      'http://localhost:3000/api/rejected-verification/types/rejections'
    );
  }
}

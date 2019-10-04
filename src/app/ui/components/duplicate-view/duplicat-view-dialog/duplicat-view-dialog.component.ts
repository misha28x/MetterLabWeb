import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Verification } from 'src/app/interfaces/verifications';
import { DataService } from 'src/app/services/data.service';

const url = 'http://localhost:3000/api/new-verifications/duplicate';
@Component({
  selector: 'app-duplicat-view-dialog',
  templateUrl: './duplicat-view-dialog.component.html',
  styleUrls: ['./duplicat-view-dialog.component.scss']
})
export class DuplicatViewDialogComponent implements OnInit {
  duplicates: Observable<Verification>;

  constructor(private dataSv: DataService, @Inject(MAT_DIALOG_DATA) public data: Verification) {}

  ngOnInit(): void {
    const address = {
      district: this.data.district,
      street: this.data.street,
      house: this.data.house,
      flat: this.data.apartment
    };

    this.duplicates = this.dataSv.sendData(url, address);
  }
}

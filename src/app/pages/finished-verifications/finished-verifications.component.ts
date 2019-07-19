import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { UploadService } from '../../services/upload.service';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';
import { filter, switchMap } from 'rxjs/operators';
import { Verification } from '../../interfaces/verifications';

@Component({
  selector: 'app-finished-verifications',
  templateUrl: './finished-verifications.component.html',
  styleUrls: ['./finished-verifications.component.scss']
})
export class FinishedVerificationsComponent implements OnInit {
  newVerifications: Observable<any[]>;
  employee: string;

  selectedData: any[];

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private uploadSv: UploadService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.updateData();
    this.newVerifications = this.sourceSv.getLab();
  }

  ngOnInit(): void {
    this.selectedData = [];
    this.employee = 'Віталій Кришталюк';
    this.updateData();
  }

  updateData(): void {
    this.sourceSv.fetchLabRequest();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id);
  }

  getScan(id: string): void {
    this.uploadSv.getScan(id);
  }

  rejectVerification(id: number): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.verificationSv.rejectVerification(id, res))
      )
      .subscribe(() => this.updateData());
  }

  rejectSelectedVerifications(): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res =>
          combineLatest(
            this.selectedData.map((ver: Verification) =>
              this.verificationSv.rejectVerification(ver.applicationNumber, res)
            )
          )
        )
      )
      .subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verificationSv
      .openDeleteDialog()
      .pipe(
        filter(res => !!res),
        switchMap(() => this.verificationSv.deleteVerification(id))
      )
      .subscribe(() => this.updateData());
  }

  cancelEmployee(id: number): void {
    this.verificationSv.cancelEmployee(id).subscribe(() => this.updateData());
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

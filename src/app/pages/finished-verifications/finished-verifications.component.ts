import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { Verification } from '../../interfaces/verifications';
import { SourceService } from '../../services/source.service';
import { UploadService } from '../../services/upload.service';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

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
    this.newVerifications = this.sourceSv.getProvidersArchive();
    this.sourceSv.getProvidersArchive().subscribe();
  }

  ngOnInit(): void {
    this.selectedData = [];
    this.employee = 'Віталій Кришталюк';
    this.updateData();
  }

  updateData(): void {
    this.sourceSv.fetchProvidersArchive();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
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

  onChange(data: any): void {
    this.selectedData = data;
  }
}

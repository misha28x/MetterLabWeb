import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
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

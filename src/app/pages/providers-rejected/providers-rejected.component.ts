import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

@Component({
  selector: 'app-rejected-verification',
  templateUrl: './providers-rejected.component.html',
  styleUrls: ['./providers-rejected.component.scss']
})
export class ProvidersRejectedComponent implements OnInit {
  rejectedVerif: Observable<any[]>;
  selectedData: any[];
  employee: string;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.sourceSv.fetchRejectedVerif();
  }

  ngOnInit(): void {
    this.rejectedVerif = this.sourceSv.getRejectedVerifications();
  }

  updateData(): void {
    this.sourceSv.fetchRejectedVerif();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verificationSv.deleteVerification(id).subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: Verification): void {
    this.verificationSv.addVerification(verification);
  }

  revertVerif(id: any): void {
    this.verificationSv.revertVerif(id).subscribe(() => this.updateData());
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

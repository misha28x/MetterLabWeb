import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { VerificationDTO } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

const url = 'http://165.22.83.21:3000/api/new-verifications';

@Component({
  selector: 'app-rejected-verification',
  templateUrl: './rejected-verification.component.html',
  styleUrls: ['./rejected-verification.component.scss']
})
export class PageRejectedVerificationComponent implements OnInit {
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

  checkForDuplicate(verification: VerificationDTO): void {
    this.verificationSv.addVerification(verification);
  }

  revertVerif(id: any): void {
    this.verificationSv.revertVerif(id).subscribe(() => this.updateData());
  }

  onChange(data: any, state: boolean): void {
    this.selectedData = data;
  }
}

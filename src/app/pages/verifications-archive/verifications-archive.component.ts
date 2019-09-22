import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { ProvidersService } from '../../services/providers.service';
import { ProtocolService } from '../../services/protocol.service';
import { VerificationService } from '../../services/verification.service';

import { ScanUploadComponent } from '../../ui/components/scan-upload';
import { SelectDialogComponent } from '../../ui/components/select-dialog';

import { Protocol } from '../../interfaces/protocol';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss']
})
export class PageVerificationsArchiveComponent implements OnInit {
  verificationsArchive: Observable<any[]>;
  dateStatus: boolean;
  currentDate: Date;
  selectedData: any[];

  constructor(
    public providersSv: ProvidersService,
    private http: HttpClient,
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private protocolSv: ProtocolService,
    private verificationSv: VerificationService
  ) {
    this.sourceSv.fetchArchive();
    this.verificationsArchive = this.sourceSv.getArchive();
    this.currentDate = new Date();
  }

  ngOnInit(): void {}

  detailView(id: any): void {
    this.detailSv.addVerification(id);
  }

  editProvider(id: string, provider: string, type: string): void {
    const ref = this.dialog.open(SelectDialogComponent, {
      data: {
        provider: provider,
        type: type
      }
    });

    ref.afterClosed().subscribe(data => {
      if (data) {
        const url = 'http://165.22.83.21:3000/api/verifications-archive/service-provider/' + id;

        this.http.post(url, { provider: data.provider, type: data.type }).subscribe(() => this.update);
      }
    });
  }

  displayProtocol(id: string): void {
    const url = 'http://165.22.83.21:3000/api/verications-protocols';
    this.dataSv.getData(url + '/protocol/' + id).subscribe((protocol: Protocol) => {
      this.protocolSv.addProtocol(protocol);
    });
  }

  setIssueDate(): void {
    this.selectedData.forEach((data: Verification) => {
      this.verificationSv
        .setIssueDate(data.applicationNumber, this.currentDate.toISOString())
        .subscribe(() => this.update());
    });

    this.selectedData.length = 0;
  }

  addScan(id: string): void {
    this.dialog.open(ScanUploadComponent, {
      data: { id: id }
    });
  }

  update(): void {
    this.sourceSv.fetchArchive();
  }

  downloadDoc(id: string): void {
    this.protocolSv.downloadDoc(id);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

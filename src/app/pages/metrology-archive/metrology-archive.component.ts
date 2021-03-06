import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { ProvidersService } from '../../services/providers.service';
import { DetailViewService } from '../../services/detail-view.service';
import { ProtocolService } from '../../services/protocol.service';
import { VerificationService } from '../../services/verification.service';

import { Protocol } from '../../interfaces/protocol';

const url = 'http://165.22.83.21:3000/api/verications-protocols';

@Component({
  selector: 'page-metrology-archive',
  templateUrl: './metrology-archive.component.html',
  styleUrls: ['./metrology-archive.component.scss']
})
export class PageMetrologyArchiveComponent implements OnInit {
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
    this.sourceSv.fetchMetrologyArchive();
    this.verificationsArchive = this.sourceSv.getMetrolohyArchive();
    this.currentDate = new Date();
  }

  ngOnInit(): void {}

  detailView(id: any): void {
    this.detailSv
      .addVerification(id)
      .subscribe(() => this.sourceSv.fetchMetrologyArchive());
  }

  displayProtocol(id: string, bbi: string): void {
    this.dataSv
      .getData(`${url}/protocol/${id}/${bbi}`)
      .subscribe((protocol: Protocol) => {
        this.protocolSv.addProtocol(protocol);
      });
  }

  update(): void {
    this.sourceSv.fetchArchive();
  }

  downloadDoc(id: string, bbi: string): void {
    this.protocolSv.downloadDoc(id, bbi);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

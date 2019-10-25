import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { DetailViewService } from '../../services/detail-view.service';
import { ProvidersService } from '../../services/providers.service';
import { ProtocolService } from '../../services/protocol.service';

import { ScanUploadComponent } from '../../ui/components/scan-upload';

import { Protocol } from '../../interfaces/protocol';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private protocolSv: ProtocolService
  ) {
    this.sourceSv.fetchArchive();
    this.verificationsArchive = this.sourceSv.getArchive();
    this.currentDate = new Date();
  }

  ngOnInit(): void {}

  detailView(id: any): void {
    this.detailSv.addVerification(id).subscribe(() => this.update());
  }

  displayProtocol(id: string): void {
    const url = 'http://localhost:3000/api/verications-protocols';
    this.dataSv.getData(url + '/protocol/' + id).subscribe((protocol: Protocol) => {
      this.protocolSv.addProtocol(protocol);
    });
  }

  addScan(id: string): void {
    this.dialog.open(ScanUploadComponent, {
      data: { id: id }
    });
  }

  update(): void {
    console.log('update');
    this.sourceSv.fetchArchive();
  }

  downloadDoc(id: string, mId: string): void {
    this.protocolSv.downloadDoc(id, mId);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

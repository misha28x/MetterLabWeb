import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { DetailViewService } from '../../services/detail-view.service';
import { ProtocolService } from '../../services/protocol.service';

import { ScanUploadComponent } from '../../ui/components/scan-upload';
import { SelectDialogComponent } from '../../ui/components/select-dialog';
import { SealEditComponent } from '../../ui/components/seal-edit';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss']
})
export class PageVerificationsArchiveComponent implements OnInit {

  verificationsArchive: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private protocolSv: ProtocolService) {
    this.sourceSv.fetchArchive();
    this.verificationsArchive = this.sourceSv.getArchive();
  }

  ngOnInit(): void { }

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
        const url = 'http://localhost:3000/api/verifications-archive/service-provider/' + id;

        this.http.post(
         url, { provider: data.provider, type: data.type })
        .subscribe(() => this.update);
      }
    });
  }

  editSeal(id: number): void {
    const ref = this.dialog.open(SealEditComponent);

    ref.afterClosed().subscribe((data: any) => {
      if (data) {
        const url = 'http://localhost:3000/api/verifications-archive/service-provider/' + id;

        this.http.post(
          url, { date: data.date, number: data.number, comment: data.comment })
          .subscribe(() => this.update);
      }
    });
  }

  displayProtocol(id: string): void {
    const url = 'http://localhost:3000/api/verications-protocols';

    this.dataSv.getData(url + '/' + id).subscribe(
      (protocol) => {
        this.protocolSv.addProtocol(protocol);
      }
    );
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
    window.open('http://localhost:3000/api/report-formation/doc/' + id);
  }
}

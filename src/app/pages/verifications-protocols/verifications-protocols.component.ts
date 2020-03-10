import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { VerificationService } from '../../services/verification.service';
import { ProtocolService } from '../../services/protocol.service';
import { SourceService } from '../../services/source.service';
import { DataService } from '../../services/data.service';
import { Protocol } from '../../interfaces/protocol';
import { TableComponent } from '../../ui/components/table';

const url = 'http://165.22.83.21:3000/api/verications-protocols';

@Component({
  selector: 'app-verifications-protocols',
  templateUrl: './verifications-protocols.component.html',
  styleUrls: ['./verifications-protocols.component.scss']
})
export class PageVerificationsProtocolsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: TableComponent;

  protocols: Observable<any>;
  selectedData: any[];

  constructor(
    private dataSv: DataService,
    private sourceSv: SourceService,
    private protocolSv: ProtocolService,
    private verificationSv: VerificationService
  ) {
    this.selectedData = [];
    this.sourceSv.fetchProtocols();
  }

  ngOnInit(): void {
    this.protocols = this.sourceSv.getProtocols();
  }

  updateData(): void {
    this.sourceSv.fetchProtocols();

    if (this.table) {
      this.table.clearSelected();
    }
  }

  sendProtocols(): void {
    const protocolsSending = this.selectedData.map(ver =>
      this.dataSv.sendData(url + '/metrology/' + ver.applicationNumber)
    );

    forkJoin(protocolsSending).subscribe(() => this.updateData());
  }

  displayProtocol(id: string, bbi: string): void {
    this.dataSv
      .getData(`${url}/protocol/${id}/${bbi}`)
      .subscribe((protocol: Protocol) => {
        this.protocolSv.addProtocol(protocol);
      });
  }

  onChange(data: any): void {
    this.selectedData = data;
  }

  deleteProtocol(id: any, bbi: string): void {
    this.verificationSv.deleteProtocol(id, bbi).subscribe(() => this.updateData());
  }
}

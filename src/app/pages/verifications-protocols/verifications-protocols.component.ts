import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { VerificationService } from '../../services/verification.service';
import { ProtocolService } from '../../services/protocol.service';
import { SourceService } from '../../services/source.service';
import { DataService } from '../../services/data.service';
import { Protocol } from '../../interfaces/protocol';

const url = 'http://134.209.243.90:3000/api/verications-protocols';

@Component({
  selector: 'app-verifications-protocols',
  templateUrl: './verifications-protocols.component.html',
  styleUrls: ['./verifications-protocols.component.scss']
})
export class PageVerificationsProtocolsComponent implements OnInit {
  protocols: Observable<any>;
  selectedData: any[];

  constructor(
    private dataSv: DataService,
    private sourceSv: SourceService,
    private protocolSv: ProtocolService,
    private verifSv: VerificationService
  ) {
    this.selectedData = [];
    this.sourceSv.fetchProtocols();
  }

  ngOnInit(): void {
    this.protocols = this.sourceSv.getProtocols();
  }

  sendProtocols(): void {
    this.selectedData.forEach((ver: any) =>
      this.dataSv
        .sendData(url + '/metrology/' + ver.applicationNumber)
        .subscribe(() => {
          this.sourceSv.fetchProtocols();
        })
    );
  }

  displayProtocol(id: string): void {
    this.dataSv
      .getData(url + '/protocol/' + id)
      .subscribe((protocol: Protocol) => {
        this.protocolSv.addProtocol(protocol);
      });
  }

  onChange(data: any): void {
    this.selectedData = data;
  }

  rejectVerification(id: number): void {
    this.verifSv
      .rejectVerification(id)
      .subscribe(() => this.sourceSv.fetchProtocols());
  }

  checkForDuplicate(verification: any): void {
    this.verifSv.addVerification(verification);
  }

  deleteProtocol(id: any): void {
    this.verifSv.deleteProtocol(id).subscribe();
  }
}

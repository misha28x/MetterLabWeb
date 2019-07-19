import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { VerificationService } from '../../services/verification.service';
import { ProtocolService } from '../../services/protocol.service';
import { SourceService } from '../../services/source.service';
import { DataService } from '../../services/data.service';
import { Protocol } from '../../interfaces/protocol';
import { filter, switchMap } from 'rxjs/operators';

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
  }

  sendProtocols(): void {
    this.selectedData.forEach((ver: any) =>
      this.dataSv.sendData(url + '/metrology/' + ver.applicationNumber).subscribe(() => updateData())
    );
  }

  displayProtocol(id: string): void {
    this.dataSv.getData(url + '/protocol/' + id).subscribe((protocol: Protocol) => {
      this.protocolSv.addProtocol(protocol);
    });
  }

  onChange(data: any): void {
    this.selectedData = data;
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

  checkForDuplicate(verification: any): void {
    this.verificationSv.addVerification(verification);
  }

  deleteProtocol(id: any): void {
    this.verificationSv.deleteProtocol(id).subscribe();
  }
}

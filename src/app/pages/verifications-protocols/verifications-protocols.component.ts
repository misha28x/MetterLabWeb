import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { VerificationService } from '../../services/verification.service';
import { ProtocolService } from '../../services/protocol.service';
import { SourceService } from '../../services/source.service';
import { DataService } from '../../services/data.service';
import { Protocol } from '../../interfaces/protocol';

const url = 'http://localhost:3000/api/verications-protocols';

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
    this.selectedData.forEach((ver: any) => this.dataSv.sendData(url + '/metrology/' + ver)
    .subscribe( () => {
      this.sourceSv.fetchProtocols();
      this.selectedData.length -= 1;
    }));
  }

  displayProtocol(id: string): void { 
    this.dataSv.getData(url + '/' + id).subscribe(
      (protocol: Protocol) => {
        this.protocolSv.addProtocol(protocol);
      }
    ); 
  }

  onChange(data: any, state: boolean): void {
    if (state) {
      this.selectedData.push(data);
    } else {
      this.selectedData = this.selectedData.filter(
        (val: any) => {
          return val !== data;
        }
      );
    }
  }

  rejectVerification(id: number): void {
    this.verifSv.rejectVerification(id).subscribe(() => this.sourceSv.fetchProtocols());
  }

  cancellEmployee(id: number): void {
    this.verifSv.cancellEmployee(id).subscribe(() => this.sourceSv.fetchProtocols());
  }

  checkForDuplicate(verification: any): void {
    this.verifSv.addVerification(verification);
  }

  clientInaccesable(id: any): void {
    this.verifSv.clientInaccesable(id).subscribe(() => this.sourceSv.fetchProtocols());
  }

  deleteProtocol(id: any): void {
    this.verifSv.deleteProtocol(id).subscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
    private protocolSv: ProtocolService
  ) {
    this.sourceSv.fetchProtocols();
    this.selectedData = [];
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
}

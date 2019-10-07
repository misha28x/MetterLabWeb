import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Protocol } from '../../interfaces/protocol';
import { ProtocolService } from '../../services/protocol.service';

const url = 'http://165.22.83.21:3000/api/verications-protocols';

@Component({
  selector: 'app-rejected-protocols',
  templateUrl: './rejected-protocols.component.html',
  styleUrls: ['./rejected-protocols.component.scss']
})
export class PageRejectedProtocolsComponent implements OnInit {
  rejectedProtocols: Observable<any[]>;

  constructor(
    private dataSv: DataService,
    private sourceSv: SourceService,
    private protocolSv: ProtocolService
  ) {
    this.sourceSv.fetchRejectedProtocols();
    this.rejectedProtocols = this.sourceSv.getRejectedProtocols();
  }

  ngOnInit(): void {}

  updateList(): void {
    this.sourceSv.fetchRejectedProtocols();
  }

  displayProtocol(id: string): void {
    this.dataSv.getData(url + '/protocol/' + id).subscribe((protocol: Protocol) => {
      this.protocolSv.addProtocol(protocol);
    });
  }

  returnProtocol(id: string): void {
    this.protocolSv.recycleProtocol(id).subscribe(() => {
      this.updateList();
    });
  }
}

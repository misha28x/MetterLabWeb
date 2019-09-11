import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Protocol } from '../../interfaces/protocol';
import { ProtocolService } from '../../services/protocol.service';

const url = 'http://165.22.83.21:3000/api/verications-protocols';

@Component({
  selector: 'app-metrology-rejected',
  templateUrl: './metrology-rejected.component.html',
  styleUrls: ['./metrology-rejected.component.scss']
})
export class MetrologyRejectedComponent implements OnInit {
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

  displayProtocol(id: string): void {
    this.dataSv.getData(url + '/protocol/' + id).subscribe((protocol: Protocol) => {
      this.protocolSv.addProtocol(protocol);
    });
  }

  rejectProtocol(id: string): void {}
}

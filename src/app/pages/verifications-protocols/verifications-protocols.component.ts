import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { ProtocolService } from '../../services/protocol.service';
import { Protocol } from '../../interfaces/protocol';

const url = 'http://localhost:3000/api/verications-protocols';

@Component({
  selector: 'app-verifications-protocols',
  templateUrl: './verifications-protocols.component.html',
  styleUrls: ['./verifications-protocols.component.scss']
})
export class PageVerificationsProtocolsComponent implements OnInit {
  protocols: Observable<any>;

  constructor(private dataSv: DataService, private protocolSv: ProtocolService) { }

  ngOnInit(): void {
    this.protocols = this.dataSv.getData(url);
  }

  displayProtocol(id: string): void { 
    this.dataSv.getData(url + '/' + id).subscribe(
      (protocol: Protocol) => {
        this.protocolSv.addProtocol(protocol);
      }
    ); 
  }
}

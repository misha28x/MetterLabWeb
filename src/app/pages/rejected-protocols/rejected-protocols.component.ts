import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';

@Component({
  selector: 'app-rejected-protocols',
  templateUrl: './rejected-protocols.component.html',
  styleUrls: ['./rejected-protocols.component.scss']
})
export class PageRejectedProtocolsComponent implements OnInit {

	rejectedProtocols: Observable<any[]>;

	constructor(private dataSv: DataService, private sourceSv: SourceService) { 
    this.sourceSv.fetchRejectedProtocols();
    this.rejectedProtocols = this.sourceSv.getRejectedProtocols();
  }

  ngOnInit(): void { }
}

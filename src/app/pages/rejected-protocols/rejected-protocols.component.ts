import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

const url = 'http://localhost:3000/api/rejected-protocols';

@Component({
  selector: 'app-rejected-protocols',
  templateUrl: './rejected-protocols.component.html',
  styleUrls: ['./rejected-protocols.component.scss']
})
export class PageRejectedProtocolsComponent implements OnInit {

	rejectedProtocols: Observable<any[]>;

	constructor(private dataSv: DataService) { }

  ngOnInit(): void {
		this.rejectedProtocols = this.dataSv.getData(url);
  }
}

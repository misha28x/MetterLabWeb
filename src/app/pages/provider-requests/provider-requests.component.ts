import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

const url = 'http://localhost:3000/api/provider-requests';

@Component({
  selector: 'app-provider-requests',
  templateUrl: './provider-requests.component.html',
  styleUrls: ['./provider-requests.component.scss'],
})
export class PageProviderRequestsComponent implements OnInit {
  providerRequests: Observable<any[]>;
  selectedData: any[];

  constructor(private dataSv: DataService) {}

  ngOnInit(): void {
    this.providerRequests = this.dataSv.getData(url);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

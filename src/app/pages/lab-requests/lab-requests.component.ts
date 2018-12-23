import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class PageLabRequestsComponent implements OnInit {

  labRequests: Observable<any[]>;
  private url: string;

  constructor(private dataSv: DataService) { }

  ngOnInit(): void {
    this.url = 'http://localhost:3000/api/lab-requests';
    this.labRequests = this.dataSv.getData(this.url);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-verifications',
  templateUrl: './new-verifications.component.html',
  styleUrls: ['./new-verifications.component.scss']
})
export class PageNewVerificationsComponent implements OnInit {

	newVerifications: Observable<any[]>;
	private url: string;

  constructor(private dataSv: DataService) { }

  ngOnInit(): void {
		this.url = 'http://localhost:3000/api/new-verifications';

		this.newVerifications = this.dataSv.getData(this.url);
  }
}

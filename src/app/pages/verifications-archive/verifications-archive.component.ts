import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

const url = 'http://localhost:3000/api/verifications-archive';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss']
})
export class PageVerificationsArchiveComponent implements OnInit {

	verificationsArchive: Observable<any[]>;

	constructor(private dataSv: DataService) { }

  ngOnInit(): void {
		this.verificationsArchive = this.dataSv.getData(url);
  }
}

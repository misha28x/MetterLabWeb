import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss']
})
export class PageVerificationsArchiveComponent implements OnInit {

	verificationsArchive: Observable<any[]>;

	constructor(private dataSv: DataService, private sourceSv: SourceService) { 
    this.sourceSv.fetchArchive();
    this.verificationsArchive = this.sourceSv.getArchive();
  }

  ngOnInit(): void { }
}

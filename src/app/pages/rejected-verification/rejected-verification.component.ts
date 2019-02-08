import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SourceService } from '../../services/source.service';

@Component({
  selector: 'app-rejected-verification',
  templateUrl: './rejected-verification.component.html',
  styleUrls: ['./rejected-verification.component.scss']
})
export class PageRejectedVerificationComponent implements OnInit {

  rejectedVerifications: Observable<any>;
  constructor(private sourceSv: SourceService) { 
    this.sourceSv.fetchRejectedVerif();
    this.rejectedVerifications = this.sourceSv.getRejectedVerifications();
  }

  ngOnInit(): void {
  }
}

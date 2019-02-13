import { Component } from '@angular/core';

import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class PageReportsComponent {
  selectedRange: Date[];
  selectedDate: Date;

  constructor(private reportsSv: ReportsService) { 
    this.selectedDate = new Date();
    this.selectedRange = [new Date(), new Date()];
  }

  downloadInProgress(date: string): void {
    const type = 'in-progress/';
    this.downloadReport(type, date);
  }

  downloadCompleted(date: string): void {
    const type = 'completed/';
    this.downloadReport(type, date);
  }

  downloadConvert(date: string): void {
    const type = 'convert/';
    this.downloadReport(type, date);
	}
	
	downloadRejected(date: string): void {
		const type = 'rejected/';
		this.downloadReport(type, date);
	}

  downloadReport(type: string, date: string): void {
    let dateArr = [date];
    if (date.split(' - ').length > 0) {
      dateArr = date.split(' - ');
    }
    console.log({ dateArray: dateArr });

    this.reportsSv.getReport(type, dateArr);
  }
}

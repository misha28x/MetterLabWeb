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

  resolvedDay: Date;
  resolvedRange: Date[];

  rejectedDay: Date;
  rejectedRange: Date[];

  inWorkDay: Date;
  inWorkRange: Date[];

  constructor(private reportsSv: ReportsService) {
    this.selectedDate = new Date();
    this.selectedRange = [new Date(), new Date()];
  }

  downloadInProgress(date: Date | Date[]): void {
    const type = 'in-progress/';
    this.downloadReport(type, date);
  }

  downloadCompleted(date: Date | Date[]): void {
    const type = 'completed/';
    this.downloadReport(type, date);
  }
  ф;
  downloadRejected(date: Date | Date[]): void {
    const type = 'rejected/';
    this.downloadReport(type, date);
  }

  downloadReport(type: string, date: Date | Date[]): void {
    const dateArr = Array.isArray(date)
      ? [this.getDateString(date[0]), this.getDateString(date[1])]
      : [this.getDateString(date)];

    this.reportsSv.getReport(type, dateArr);
  }

  getDateString(d: Date): string {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
  }
}

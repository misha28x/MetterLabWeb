import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { ReportsService, ReportType } from '../../services/reports.service';
import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class PageReportsComponent implements OnInit {
  user: IUser;
  selectedRange: Date[];
  selectedDate: Date;

  resolvedDay: Date;
  resolvedRange: Date[];

  rejectedDay: Date;
  rejectedRange: Date[];

  inWorkDay: Date;
  inWorkRange: Date[];

  constructor(private reportsSv: ReportsService, private store: Store<IUser>) {
    this.selectedDate = new Date();
    this.selectedRange = [new Date(), new Date()];
  }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => (this.user = _user));
  }

  downloadInProgress(date: Date | Date[]): void {
    this.downloadReport('in-progress', date);
  }

  downloadCompleted(date: Date | Date[]): void {
    this.downloadReport('completed', date);
  }

  downloadRejected(date: Date | Date[]): void {
    this.downloadReport('rejected', date);
  }

  downloadSent(date: Date | Date[]): void {
    this.downloadReport('sent', date);
  }

  downloadReport(type: ReportType, date: Date | Date[]): void {
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

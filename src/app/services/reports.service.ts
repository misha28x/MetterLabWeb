import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { User } from '../interfaces/user';

enum DateType  {
  Single = 'single/',
  Range = 'range/'
}

enum ReportType {
  InProgress = 'in-progress/',
  Completed = 'completed/',
	Convert = 'convert/',
	Rejected = 'rejected/'
}

const Url = 'http://134.209.243.90:3000/api/reports/';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private user: User;

  constructor(
    private http: HttpClient,
    private store: Store<User>
  ) { 
    this.store.pipe(select('permission')).subscribe(_user => this.user = _user);
  }

  public getReport(type: string, date: string[]): void {
    const reportType = this.getReportType(type);
    const reportDate = this.getDate(date);
    const dateType = reportDate.type;
    const serviceProvider = '/' + this.user.createFor;

    const url = Url + reportType + dateType  + date  + serviceProvider;

    window.open(url);
  }

  getReportType(type: string): string {
    let reportType = 'in-progress/';

    if (Object.values(ReportType).includes(type)) {
      reportType = type;
    }

    return reportType;
  }

  getDate(date: string[]): any {
    if (date.length > 1) {
      return {
        date: date[0] + '-' + date[1],
        type: DateType.Range
      };
    }

    return {
      date: date[0],
      type: DateType.Single
    };
  }
}

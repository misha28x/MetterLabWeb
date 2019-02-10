import { Injectable } from '@angular/core';
import { ResponseContentType } from '@angular/http';

import { HttpClient } from '@angular/common/http';

enum DateType  {
  Single = 'single/',
  Range = 'range/'
}

enum ReportType {
  InProgress = 'in-progress/',
  Completed = 'completed/',
  Convert = 'convert/'
}

const Url = 'http://localhost:3000/api/reports/';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  public getReport(type: string, date: string[]): void {
    const reportType = this.getReportType(type);
    const reportDate = this.getDate(date);
    const dateType = reportDate.type;

    const url = Url + reportType + dateType  + date ;

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

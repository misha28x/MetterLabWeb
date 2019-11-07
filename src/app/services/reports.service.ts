import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { IUser } from '../interfaces/user';

export interface ReportDateType {
  type: 'single' | 'range';
  date: string;
}

export type ReportType = 'in-progress' | 'completed' | 'convert' | 'rejected' | 'sent';

const Url = 'http://165.22.83.21:3000/api/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private user: IUser;

  constructor(private http: HttpClient, private store: Store<IUser>) {
    this.store.pipe(select('permission')).subscribe(_user => (this.user = _user));
  }

  public getMetrologyReport(date: [Date, Date]): void {
    const [start, end] = date.map(value => this.getDateString(value));
    const url = `${Url}/metrology/${start}/${end}`;

    window.open(url);
  }

  public getReport(type: ReportType, date: string[]): void {
    const reportDate = this.getDate(date);

    const dateType = reportDate.type;

    const serviceProvider = this.user.createFor;
    const isProvider = this.user.permission > 5 ? 'provider' : '';

    const url = `${Url}/${isProvider}/${type}/${dateType}/${date}/${serviceProvider}`;

    window.open(url);
  }

  getDate(date: string[]): ReportDateType {
    if (date.length > 1) {
      return {
        date: date[0] + '-' + date[1],
        type: 'range'
      };
    }

    return {
      date: date[0],
      type: 'single'
    };
  }

  getDateString(d: Date): string {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
  }
}

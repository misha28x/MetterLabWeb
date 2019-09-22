import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-metrology-reports',
  templateUrl: './metrology-reports.component.html',
  styleUrls: ['./metrology-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetrologyReportsComponent implements OnInit {
  weekStart: Date;
  weekEnd: Date;

  monthStart: Date;
  monthEnd: Date;

  monthStartDate: Date;

  dayReportDate: Date;
  rangeReportDate: Date[];

  monthReportDate: Date;
  weekReportDate: Date;

  constructor(private reportSv: ReportsService) {}

  ngOnInit(): void {
    [this.weekStart, this.weekEnd] = this.getCurrentWeek();
    [this.monthStart, this.monthEnd] = this.getCurrentMonth();

    this.monthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  }

  getCurrentWeek(date: Date = new Date()): [Date, Date] {
    const currentDay = date.getDay();
    const currentDate = date.getDate();

    const start = currentDate - currentDay + (currentDay === 0 ? -6 : 1);
    const end = start + 4;

    const startDate = new Date(date.getFullYear(), date.getMonth(), start);
    const endDate = new Date(date.getFullYear(), date.getMonth(), end);

    return [startDate, endDate];
  }

  getCurrentMonth(date: Date = new Date()): [Date, Date] {
    const currentMonth = date.getMonth();

    const start = new Date(date.getFullYear(), currentMonth, 1);
    const end = new Date(date.getFullYear(), currentMonth + 1, 0);

    return [start, end];
  }

  getDateString(d: Date): string {
    const date = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${date > 9 ? date : '0' + date}.${month > 9 ? month : '0' + month}.${year}`;
  }

  getDayReport(date: Date = new Date()): void {
    this.getReport([date, date]);
  }

  getWeekReport(date: Date = new Date()): void {
    this.getReport(this.getCurrentWeek(date));
  }

  getMonthReport(date: Date = new Date()): void {
    this.getReport(this.getCurrentMonth(date));
  }

  getReport(date: [Date, Date]): void {
    this.reportSv.getMetrologyReport(date);
  }
}

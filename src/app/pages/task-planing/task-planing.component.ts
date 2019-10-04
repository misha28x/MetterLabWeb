import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';

import { IUser } from '../../interfaces/user';
import { Task } from '../../interfaces/taskData';
import { Verification } from '../../interfaces/verifications';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { ProvidersService } from '../../services/providers.service';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

import { TaskSendingComponent } from './task-sending/task-sending.component';
import { UserInfoComponent } from '../../ui/components/user-info';
import { TableComponent } from '../../ui/components/table';

@Component({
  selector: 'app-task-planing',
  templateUrl: './task-planing.component.html',
  styleUrls: ['./task-planing.component.scss']
})
export class PageTaskPlaningComponent implements OnInit {
  @ViewChild('table', { static: false }) table: TableComponent;

  data: any;
  config: any;
  columns: Array<any>;
  tableData: any;

  selectedData: any[];
  employee: string;
  user: IUser;

  constructor(
    public providersSv: ProvidersService,
    private dialog: MatDialog,
    private store: Store<IUser>,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {}

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
    });

    this.sourceSv.fetchTaskPlaning();

    this.config = {
      sorting: { columns: this.columns },
      filtering: {
        filterString: ''
      }
    };

    this.selectedData = [];

    this.tableData = this.sourceSv.getTaskPlaning();
  }

  sendData(): void {
    const url = 'http://165.22.83.21:3000/api/task-planing/stations/' + this.user.serviceProvider;

    const obs = this.dataSv
      .getData(url)
      .pipe(map((res: any[]) => res.map(station => station.stationNumber)));

    const dialogRef = this.dialog.open(TaskSendingComponent, {
      data: obs
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(val => !!val),
        switchMap((data: Task) => {
          const taskData = {
            taskDate: data.taskDate,
            type: data.serviceType,
            stationNumber: data.stationNumber,
            verifications: this.selectedData,
            serviceProvider: this.user.serviceProvider
          };

          const sendUrl = 'http://165.22.83.21:3000/api/task-planing/station-task';

          return this.dataSv.sendData(sendUrl, taskData);
        })
      )
      .subscribe(() => this.updateData());
  }

  onChange(data: any): void {
    this.selectedData = data;
  }

  updateData(): void {
    this.sourceSv.fetchTaskPlaning();
    this.table.clearSelected();
    this.selectedData = [];
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }

  addVerificationToTask(): void {
    this.verificationSv
      .openTaskSelection()
      .pipe(
        switchMap(taskId => {
          const obs = this.selectedData.map(ver =>
            this.verificationSv.addVerificationToTask(ver.applicationNumber, taskId)
          );
          return combineLatest(obs);
        })
      )
      .subscribe(() => this.updateData());
  }

  rejectVerification(id: number): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.verificationSv.rejectVerification(id, res))
      )
      .subscribe(() => {
        this.updateData();
        this.selectedData = [];
      });
  }

  rejectSelectedVerifications(): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res =>
          combineLatest(
            this.selectedData.map((ver: Verification) =>
              this.verificationSv.rejectVerification(ver.applicationNumber, res)
            )
          )
        )
      )
      .subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verificationSv
      .openDeleteDialog()
      .pipe(
        filter(res => !!res),
        switchMap(() => this.verificationSv.deleteVerification(id))
      )
      .subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: Verification): void {
    this.verificationSv.addVerification(verification);
  }

  clientInaccesable(id: any): void {
    this.verificationSv.clientInaccessible(id).subscribe(() => this.updateData());
  }

  showClientInfo(id: any): void {
    this.dialog.open(UserInfoComponent, {
      height: '90%',
      minWidth: '60%',
      data: id
    });
  }
}

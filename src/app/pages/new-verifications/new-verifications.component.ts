import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { IUser } from '../../interfaces/user';
import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { ProvidersService } from '../../services/providers.service';
import { VerificationService } from '../../services/verification.service';

import { UserInfoComponent } from '../../ui/components/user-info';
import { TableComponent } from '../../ui/components/table';

const url = 'http://165.22.83.21:3000/api/new-verifications';

@Component({
  selector: 'app-new-verifications',
  templateUrl: './new-verifications.component.html',
  styleUrls: ['./new-verifications.component.scss']
})
export class PageNewVerificationsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: TableComponent;

  newVerifications: Observable<any[]>;
  selectedData: any[];
  permission: number;

  user: IUser;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private store: Store<IUser>,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService,
    public providersSv: ProvidersService
  ) {
    this.newVerifications = this.sourceSv.getNewVerifications();
  }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(user => {
      this.user = user;
      this.permission = user.permission;
    });

    this.selectedData = [];
    this.updateData();
  }

  updateData(): void {
    this.sourceSv.fetchNewVerifications();
    this.selectedData = [];
    this.table.clearSelected();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }

  addEmployeeToSelected(): void {
    combineLatest(
      this.selectedData.map((ver: Verification) =>
        this.dataSv.sendData(
          `${url}/employee/${ver.applicationNumber}/${this.user.serviceProvider}`
        )
      )
    ).subscribe(() => this.updateData());
  }

  rejectVerification(id: number): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.verificationSv.rejectVerification(id, res))
      )
      .subscribe(() => this.updateData());
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

  onChange(data: any): void {
    this.selectedData = data;
  }
}

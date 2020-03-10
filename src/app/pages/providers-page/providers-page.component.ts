import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';

import { IUser } from '../../interfaces/user';
import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { VerificationDTO } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

const url = 'http://165.22.83.21:3000/api/new-verifications';

@Component({
  selector: 'app-providers-page',
  templateUrl: './providers-page.component.html',
  styleUrls: ['./providers-page.component.scss']
})
export class ProvidersPageComponent implements OnInit {
  newVerifications: Observable<any[]>;
  employee: string;

  selectedData: any[];

  permission: number;
  user: IUser;

  constructor(
    private dialog: MatDialog,
    private store: Store<IUser>,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.newVerifications = this.sourceSv.getNewVerifications();
  }

  ngOnInit(): void {
    this.selectedData = [];
    this.employee = 'Віталій Кришталюк';

    this.store.pipe(select('permission')).subscribe(user => {
      this.user = user;
      this.permission = user.permission;
    });
    this.updateData();
  }

  updateData(): void {
    this.sourceSv.fetchNewVerifications();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }

  addEmployee(id: number): void {
    this.dataSv
      .sendData(url + '/employee/' + id, { employee: this.user.username })
      .subscribe(() => this.updateData());
  }

  addEmployeeToSelected(): void {
    forkJoin(
      this.selectedData.map((ver: VerificationDTO) =>
        this.dataSv.sendData(url + '/employee/' + ver.applicationNumber, {
          employee: this.user.username
        })
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
            this.selectedData.map((ver: VerificationDTO) =>
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

  checkForDuplicate(verification: VerificationDTO): void {
    this.verificationSv.addVerification(verification);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

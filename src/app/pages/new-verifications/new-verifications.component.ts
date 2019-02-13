import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
  selector: 'app-new-verifications',
  templateUrl: './new-verifications.component.html',
  styleUrls: ['./new-verifications.component.scss']
})
export class PageNewVerificationsComponent implements OnInit {
  newVerifications: Observable<any[]>;
  employee: string;

  selectedData: any[];
  permission: number;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private store: Store<number>,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.newVerifications = this.sourceSv.getNewVerifications();
  }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(per => this.permission = per);

    this.selectedData = [];
    this.employee = 'Віталій Кришталюк';
    this.updateData();
  }

  updateData(): void {
    this.sourceSv.fetchNewVerifications();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id);
  }

  addEmployee(id: number): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        this.dataSv.sendData(url + '/employee/' + id, { employee: employee || this.employee })
          .subscribe(() => this.updateData());
      },
      () => {
        this.selectedData.length = 0;
      }
    );
  }

  addEmployeeToSelected(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        forkJoin(this.selectedData.map((ver: Verification) =>
          this.dataSv.sendData(url + '/employee/' + ver.applicationNumber, { employee: employee || this.employee }))
        ).subscribe(() => this.updateData());
      },
      () => {
        this.selectedData.length = 0;
      }
    );
  }

  cancellEmployeeToSelected(): void {
    forkJoin(this.selectedData.map((ver: Verification) =>
      this.verificationSv.cancellEmployee(ver.applicationNumber))).subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verificationSv.deleteVerification(id).subscribe(() => this.updateData());
  }

  rejectVerification(id: number): void {
    this.verificationSv.rejectVerification(id).subscribe(() => this.updateData());
  }

  cancellEmployee(id: number): void {
    this.verificationSv.cancellEmployee(id).subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: Verification): void {
    this.verificationSv.addVerification(verification);
  }

  onChange(data: any, state: boolean): void {
    if (state) {
      this.selectedData.push(data);
    } else {
      this.selectedData = this.selectedData.filter(
        (val: any) => {
          return val !== data;
        }
      );
    }
  }
}

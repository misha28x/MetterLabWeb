import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';
import { SelectDialogComponent } from '../../ui/components/select-dialog';
import { EmployeeDialogComponent } from '../new-verifications/employee-dialog/employee-dialog.component';
import { filter, switchMap } from 'rxjs/operators';

const url = 'http://134.209.243.90:3000/api/new-verifications';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class PageLabRequestsComponent implements OnInit {
  labRequests: Observable<any[]>;
  selectedData: any[];
  employee: string;

  columnsToDisplay: string[];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.sourceSv.fetchLabRequest();
  }

  ngOnInit(): void {
    this.labRequests = this.sourceSv.getLab();
  }

  updateData(): void {
    this.sourceSv.fetchLabRequest();
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
      }
    );
  }

  editProvider(id: string, provider: string, type: string): void {
    const ref = this.dialog.open(SelectDialogComponent, {
      data: {
        provider: provider,
        type: type
      }
    });

    ref.afterClosed().subscribe(data => {

      if (data) {
        const providerUrl = 'http://134.209.243.90:3000/api/verifications-archive/service-provider/' + id;

        this.http.post(
          providerUrl, { provider: data.provider, type: data.type })
          .subscribe(() => this.update());
      }
    });
  }

  update(): void {
    this.sourceSv.fetchLabRequest();
  }

  sendVerif(): void {
    forkJoin(this.selectedData
      .map((ver: Verification) => this.verificationSv.sendVerif(ver.applicationNumber))
    ).subscribe(() => this.updateData());
  }

  cancelEmployeeToSelected(): void {
    combineLatest(
      this.selectedData.map((ver: Verification) =>
        this.verificationSv.cancelEmployee(ver.applicationNumber)
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

  cancelEmployee(id: number): void {
    this.verificationSv.cancelEmployee(id).subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: Verification): void {
    this.verificationSv.addVerification(verification);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';
import { SelectDialogComponent } from '../../ui/components/select-dialog';
import { EmployeeDialogComponent } from '../new-verifications/employee-dialog/employee-dialog.component';

const url = 'http://localhost:3000/api/new-verifications';

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
    private verifSv: VerificationService
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
        const providerUrl = 'http://localhost:3000/api/verifications-archive/service-provider/' + id;

        this.http.post(
          providerUrl, { provider: data.provider, type: data.type })
          .subscribe(() => this.update());
      }
    });
  }

  update(): void {
    console.log('update');
    this.sourceSv.fetchLabRequest();
  }

  sendVerif(): void {
    forkJoin(this.selectedData
      .map((ver: Verification) => this.verifSv.sendVerif(ver.applicationNumber))
    ).subscribe(() => this.updateData());
  }

  cancellEmployeeToSelected(): void {
    forkJoin(this.selectedData.map((ver: Verification) =>
      this.verifSv.cancellEmployee(ver.applicationNumber))).subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verifSv.deleteVerification(id).subscribe(() => this.updateData());
  }

  rejectVerification(id: number): void {
    this.verifSv.rejectVerification(id).subscribe(() => this.updateData());
  }

  cancellEmployee(id: number): void {
    this.verifSv.cancellEmployee(id).subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: Verification): void {
    this.verifSv.addVerification(verification);
  }

  onChange(data: any, state: boolean): void {
    this.selectedData = data;
    console.log(data);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
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
	
  constructor(
    private dataSv: DataService,
    private dialog: MatDialog,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
    ) { }

  ngOnInit(): void {
    this.selectedData = [];
    this.employee = 'Віталій Кришталюк';
    this.updateData();
  }

  updateData(): void {
    this.newVerifications = this.dataSv.getData(url);
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id);
  }

  addEmployee(id: number ): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        this.dataSv.sendData(url + '/employee/' + id, { employee: employee || this.employee })
          .subscribe(() => this.updateData());
      }
    );
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

  checkForDuplicate(): void {
    this.verificationSv.checkForDuplicate({}).subscribe();
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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';

import { Task } from '../../interfaces/taskData';
import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';
import { EmployeeDialogComponent } from '../new-verifications/employee-dialog/employee-dialog.component';

import { TaskSendingComponent } from './task-sending/task-sending.component';
import { UserInfoComponent } from '../../ui/components/user-info';

const verificationUrl = 'http://localhost:3000/api/new-verifications';

@Component({
  selector: 'app-task-planing',
  templateUrl: './task-planing.component.html',
  styleUrls: ['./task-planing.component.scss']
})
export class PageTaskPlaningComponent implements OnInit {
	data: any;
	config: any;
	columns: Array<any>;
	tableData: any;

  selectedData: any[];
  labRequests: Observable<any[]>;
  employee: string;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) { }

  ngOnInit(): void {
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
    let stations = [];

    const url = 'http://localhost:3000/api/task-planing/stations';

    this.dataSv.getData(url)
    .subscribe(
      data => {
        stations = data.map(
          station => {
            return station.stationNumber;
          }
        );

        this.request(stations);
      }
    );
  }

  request(stations: string[]): void {
    const dialogRef = this.dialog.open(TaskSendingComponent, {
      data: stations
    });

    dialogRef.afterClosed().subscribe(
      (data: Task) => {
        const taskData = {
          taskDate: data.taskDate,
          type: data.serviceType,
					stationNumber: data.stationNumber,
          verifications: this.selectedData
        };

        const url = 'http://localhost:3000/api/task-planing/station-task';
        
        this.dataSv.sendData(url, taskData)
          .subscribe(() => this.sourceSv.fetchTaskPlaning());
      }
    );
  }

  onChange(data: any, state: boolean): void {
    this.selectedData = data;
    console.log(data);
  }

  updateData(): void {
    this.sourceSv.fetchTaskPlaning();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id);
  }

  addEmployee(id: number): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        this.dataSv.sendData(verificationUrl + '/employee/' + id, { employee: employee || this.employee })
          .subscribe(() => this.updateData());
      }
    );
  }

  addEmployeeToSelected(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        forkJoin(this.selectedData.map((ver: Verification) =>
          this.dataSv.sendData(verificationUrl + '/employee/' + ver.applicationNumber, { employee: employee || this.employee }))
        ).subscribe(() => this.updateData());
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

  clientInaccesable(id: any): void {
    this.verificationSv.clientInaccesable(id).subscribe(() => this.updateData());
  }

  showClientInfo(id: any): void {

    this.dialog.open(UserInfoComponent, {
      height: '90%',
      minWidth: '70%',
      data: id
    });
  }
}

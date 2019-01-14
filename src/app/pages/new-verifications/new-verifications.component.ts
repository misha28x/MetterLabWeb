import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
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
	
  constructor(private dataSv: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.employee = 'Віталій Кришталюк';
    this.getData();
  }

  getData(): void {
    this.newVerifications = this.dataSv.getData(url);
  }

  addEmployee(id: number ): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(
      employee => {
        this.dataSv.sendData(url + '/' + id, employee)
          .subscribe(
          () => {
            this.getData();
          }
        );
      }
    );
  }
}

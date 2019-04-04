import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '../../interfaces/user';
import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { Verification } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

import { UserInfoComponent } from '../../ui/components/user-info';

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

  user: User;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private store: Store<User>,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.newVerifications = this.sourceSv.getNewVerifications();
  }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(user => {
      this.user = user;
      this.permission = user.permission;
    });

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
    this.dataSv.sendData(url + '/employee/' + id, { employee: this.user.username })
      .subscribe(() => this.updateData());
  }

  addEmployeeToSelected(): void {
    forkJoin(this.selectedData.map((ver: Verification) =>
      this.dataSv.sendData(url + '/employee/' + ver, { employee: this.user.username }))
    ).subscribe(() => this.updateData());
  }

  cancellEmployeeToSelected(): void {
    forkJoin(this.selectedData.map((ver: Verification) =>
      this.verificationSv.cancellEmployee(ver))).subscribe(() => this.updateData());
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

  showClientInfo(id: any): void {
    
    this.dialog.open(UserInfoComponent, { 
      height: '90%',
      minWidth: '70%',
      data: id 
    });
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

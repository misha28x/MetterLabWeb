import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { User } from '../../interfaces/user';
import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { DetailViewService } from '../../services/detail-view.service';
import { VerificationService } from '../../services/verification.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class PageHomePageComponent implements OnInit {
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
    this.updateData();
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

  addEmployee(id: number): void {
    this.dataSv.sendData(url + '/employee/' + id, { employee: this.user.username })
      .subscribe(() => this.updateData());
  }
}

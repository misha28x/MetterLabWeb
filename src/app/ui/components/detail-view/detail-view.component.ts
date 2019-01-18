import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { concat, Subscription } from 'rxjs';

import { DetailViewDialogComponent } from './detail-view-dialog/detail-view-dialog.component';
import { DataService } from '../../../services/data.service';
import { DetailViewService } from '../../../services/detail-view.service';
import { Verification } from '../../../interfaces/verifications';

const employeeUrl = 'http://localhost:3000/api/new-verifications/employee';
const typeUrl = 'http://localhost:3000/api/new-verifications/device';
const symbolUrl = 'http://localhost:3000/api/new-verifications/dn';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit, OnDestroy {
  @Input() verId: number;

  subscription: Subscription;
  verification: Verification;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private detailSv: DetailViewService
    ) { }

  ngOnInit(): void {
    this.subscription = this.detailSv.getVerification()
    .subscribe((ver: Verification) => {
      this.verification = ver;
      this.getData();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialogData: any): void {
    this.dialog.open(DetailViewDialogComponent, {
      height: '90%',
      width: '600px',
      data: {
        additionalData: dialogData,
        verification: this.verification
      }
    });
  }

  getData(): void {
    const $employeeObservable = this.dataSv.getData(employeeUrl);
    const $symbolObservable = this.dataSv.getData(symbolUrl);
    const $typeObservable = this.dataSv.getData(typeUrl);

    const dataObservable = concat($employeeObservable, $symbolObservable, $typeObservable);

    const dialogData = {};

    dataObservable.subscribe(
      (next: [any]) => {
        const key = Object.keys(next[0])[0];

        dialogData[key] = next.map(val => {
          return val[key];
        });
      },
      err => this.dataSv.handleError(err),
      () => this.openDialog(dialogData)
    );
  }
}

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DetailViewDialogComponent } from './detail-view-dialog/detail-view-dialog.component';
import { DataService } from '../../../services/data.service';
import { DetailViewService } from '../../../services/detail-view.service';
import { Verification } from '../../../interfaces/verifications';

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
      this.openDialog();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(): void {
    this.dialog.open(DetailViewDialogComponent, {
      height: '90%',
      width: '800px',
      data: {
        verification: this.verification
      }
    });
  }  
}

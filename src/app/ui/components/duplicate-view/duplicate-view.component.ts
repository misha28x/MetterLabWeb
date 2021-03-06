import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { VerificationDTO } from '../../../interfaces/verifications';
import { VerificationService } from '../../../services/verification.service';
import { DuplicatViewDialogComponent } from './duplicat-view-dialog/duplicat-view-dialog.component';

@Component({
  selector: 'app-duplicate-view',
  templateUrl: './duplicate-view.component.html',
  styleUrls: ['./duplicate-view.component.scss']
})
export class DuplicateViewComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(private dialog: MatDialog, private verificationSv: VerificationService) {}

  ngOnInit(): void {
    this.subscription = this.verificationSv
      .getVerification()
      .subscribe((verification: VerificationDTO) => {
        this.openDialog(verification);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(verification: VerificationDTO): void {
    this.dialog.open(DuplicatViewDialogComponent, {
      data: verification,
      height: '90%',
      width: '98vw',
      panelClass: 'full-screen-modal'
    });
  }
}

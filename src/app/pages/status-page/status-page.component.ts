import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ClientService } from '../../services/client.service';
import { StatusDialogComponent } from '../../ui/components/status-dialog';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
  styleUrls: ['./status-page.component.scss']
})
export class StatusPageComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private clientSv: ClientService
  ) { }

  ngOnInit() {
  }

  getVerification(id: string): void {
    this.dialog.open(StatusDialogComponent, {
      minWidth: '500px',
      data: this.clientSv.getVerificationData(id)
    });
  }

  getCounterData(id: string): void {
    this.dialog.open(StatusDialogComponent, {
      minWidth: '500px',
      data: this.clientSv.getCounterData(id)
    });
  }
}

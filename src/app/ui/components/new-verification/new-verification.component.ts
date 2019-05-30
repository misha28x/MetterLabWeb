import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DataService } from '../../../services/data.service';
import { SourceService } from '../../../services/source.service';
import { SocketService } from '../../../services/socket.service';

import { NewVerificationDialogComponent } from './new-verification-dialog/new-verification-dialog.component';

const addressUrl = 'http://134.209.243.90:3000/api/new-verifications/all/address';
const typeUrl = 'http://134.209.243.90:3000/api/new-verifications/device';
const symbolUrl = 'http://134.209.243.90:3000/api/new-verifications/dn';

@Component({
  selector: 'app-new-verification',
  templateUrl: './new-verification.component.html',
  styleUrls: ['./new-verification.component.scss']
})
export class NewVerificationComponent implements OnInit {

  constructor(
    private matDialog: MatDialog,
    private dataSv: DataService,
    private socket: SocketService,
    private sourceSv: SourceService
    ) { }

  ngOnInit(): void { }

  getData(): void {
    const $addressObservable = this.dataSv.getData(addressUrl);
    const $symbolObservable = this.dataSv.getData(symbolUrl);
    const $typeObservable = this.dataSv.getData(typeUrl);

    const dialogRef = this.matDialog.open(NewVerificationDialogComponent, {
			width: '85%',
      maxWidth: 1100,
      data: {
        symbols: $symbolObservable,
        types: $typeObservable,
        address: $addressObservable
      },
      panelClass: 'full-height-modal'
    });
    
    dialogRef.afterClosed().subscribe(() => this.sourceSv.fetchNewVerifications());
  }
}

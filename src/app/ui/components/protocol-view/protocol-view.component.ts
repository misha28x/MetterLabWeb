import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Protocol } from '../../../interfaces/protocol';
import { ProtocolDialogComponent } from './protocol-dialog/protocol-dialog.component';

@Component({
  selector: 'app-protocol-view',
  templateUrl: './protocol-view.component.html',
  styleUrls: ['./protocol-view.component.scss']
})
export class ProtocolViewComponent implements OnInit {
  
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  openDialog(protocol: Protocol): void {
    this.dialog.open(ProtocolDialogComponent, {
      data: protocol,
      height: '95%',
      width: '95%'
    });
  }
}

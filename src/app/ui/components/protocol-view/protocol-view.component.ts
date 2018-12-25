import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { Protocol } from '../../../interfaces/protocol';
import { ProtocolService } from '../../../services/protocol.service';
import { ProtocolDialogComponent } from './protocol-dialog/protocol-dialog.component';

@Component({
  selector: 'app-protocol-view',
  templateUrl: './protocol-view.component.html',
  styleUrls: ['./protocol-view.component.scss']
})
export class ProtocolViewComponent implements OnInit, OnDestroy {
  @Input() protocol: Protocol;
  subscription: Subscription;

  constructor(private dialog: MatDialog, private protocolSv: ProtocolService) { }

  ngOnInit(): void {
    this.subscription = this.protocolSv.getProtocol().subscribe(
      protocol => {
        this.openDialog(protocol);
      }
    );
  }

  openDialog(protocol: Protocol): void {
    this.dialog.open(ProtocolDialogComponent, {
      data: protocol,
      height: '95%',
      width: '95%'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

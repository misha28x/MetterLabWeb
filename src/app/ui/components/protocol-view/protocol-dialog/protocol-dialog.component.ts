import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { EndStateDialogComponent } from '../end-state-dialog/end-state-dialog.component';
import { StartStateDialogComponent } from '../start-state-dialog/start-state-dialog.component';
import { CounterDialogDataComponent } from '../counter-dialog-data/counter-dialog-data.component';
import { Protocol, Test } from '../../../../interfaces/protocol';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-protocol-dialog',
  templateUrl: './protocol-dialog.component.html',
  styleUrls: ['./protocol-dialog.component.scss']
})
export class ProtocolDialogComponent implements OnInit {

  constructor(
      private dialog: MatDialog,
      private dataSv: DataService,
      @Inject(MAT_DIALOG_DATA) public data: Protocol
    ) { }

  ngOnInit(): void { }

  formatData(data: string): string {
    return parseFloat(data).toFixed(2);
  }

  saveProtocol(): void { }

  saveTests(): void { }

  changeProtocolData(protocolData: Protocol): void { 
    this.dialog.open(CounterDialogDataComponent, {
      data: protocolData
    });
  }

  changeStartState(test: Test): void {
    const startRef = this.dialog.open(StartStateDialogComponent, {
      data: {
        base64Data: test.startStateImage,
        value: test.initValue
      }
    });

    startRef.afterClosed().subscribe(val => {
      test.initValue = val;
      this.calculateExes(test);
    });
  }

  changeEndState(test: Test): void {
    const endRef = this.dialog.open(EndStateDialogComponent, {
      data: {
        base64Data: test.endStateImage,
        value: test.finalValue
      }
    });

    endRef.afterClosed().subscribe(val => {
      test.finalValue = val;
      this.calculateExes(test);
    });
  }

  calculateExes(test: Test): void {
    // TODO: обчислення за формулою
  }

  getImage(base64Data: string): any {
    return 'data:image/png;base64,' + base64Data.toString();
  }
}

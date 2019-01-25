import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { EndStateDialogComponent } from '../end-state-dialog/end-state-dialog.component';
import { StartStateDialogComponent } from '../start-state-dialog/start-state-dialog.component';
import { CounterDialogDataComponent } from '../counter-dialog-data/counter-dialog-data.component';
import { Protocol } from '../../../../interfaces/protocol';
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
    return parseFloat(data).toFixed(3);
  }

  saveProtocol(): void { }

  saveTests(): void { }

  changeProtocolData(): void { 

  }

  changeStartState(base64Data: string, value: number, id: number): void {
    this.dialog.open(StartStateDialogComponent, {
      data: {
        base64Data: base64Data.toString(),
        value: value,
        test: id
      }
    });
  }

  changeEndState(base64Data: string, value: number, id: number): void {
    this.dialog.open(EndStateDialogComponent, {
      data: {
        base64Data: base64Data,
        value: value,
        test: id 
      }
    });
  }

  getImage(base64Data: string): any {
    return 'data:image/png;base64,' + base64Data.toString();
  }
}

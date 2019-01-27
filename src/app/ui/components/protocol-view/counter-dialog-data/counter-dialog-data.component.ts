import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Protocol } from '../../../../interfaces/protocol';
import { ProtocolService } from '../../../../services/protocol.service';

@Component({
  selector: 'app-counter-dialog-data',
  templateUrl: './counter-dialog-data.component.html',
  styleUrls: ['./counter-dialog-data.component.scss']
})
export class CounterDialogDataComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CounterDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Protocol,
    private protocolSv: ProtocolService
  ) { }

  ngOnInit(): void { }
  
  saveProtocol() {
    this.protocolSv.upladteProtocol(this.data.id, this.data);
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.image.toString();
  }
}

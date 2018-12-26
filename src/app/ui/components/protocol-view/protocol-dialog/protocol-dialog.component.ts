import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Protocol } from 'src/app/interfaces/protocol';

@Component({
  selector: 'app-protocol-dialog',
  templateUrl: './protocol-dialog.component.html',
  styleUrls: ['./protocol-dialog.component.scss']
})
export class ProtocolDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Protocol) { }

  ngOnInit(): void { }

  getImage(base64Data: string): string {
    return 'data:image/png;base64, ' + base64Data;
  }
}

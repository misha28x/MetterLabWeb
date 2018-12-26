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

  getImage(src: string): string {
    return URL.createObjectURL(src);
  }
}

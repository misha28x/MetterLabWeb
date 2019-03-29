import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['../protocol-view/protocol-dialog/protocol-dialog.component.scss' ,'./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  data: any;
  isEmpty: boolean;
  constructor(
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public asyncData: Observable<any>
  ) {
    this.asyncData.subscribe(data => {
      if (!data || !data.length) {
        this.isEmpty = true;
      }

      this.data = data[0];
    });
  }

  ngOnInit() { }

  getImage(base64Data: String): any {
    return 'data:image/png;base64,' + base64Data.toString();
  }
} 

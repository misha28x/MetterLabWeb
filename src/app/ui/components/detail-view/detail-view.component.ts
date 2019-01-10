import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DetailViewDialogComponent } from './detail-view-dialog/detail-view-dialog.component';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  openDialog(): void {
    this.dialog.open(DetailViewDialogComponent, {
      height: '90%',
      width: '65%'
    });
  }
}

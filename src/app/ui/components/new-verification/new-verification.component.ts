import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { NewVerificationDialogComponent } from './new-verification-dialog/new-verification-dialog.component';

@Component({
  selector: 'app-new-verification',
  templateUrl: './new-verification.component.html',
  styleUrls: ['./new-verification.component.scss']
})
export class NewVerificationComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void { }

	openDialg(): void {
		this.matDialog.open(NewVerificationDialogComponent, {
			width: '85%',
			height: '98%',
      maxWidth: 1100
		});
	}

}

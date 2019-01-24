import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

	constructor(private dialog: MatDialog) { }

	public openUploadDialog(): void {
		this.dialog.open(UploadDialogComponent, {
			width: '55%',
			height: '55%',
      panelClass: 'dialog-container'
		});
	}
}

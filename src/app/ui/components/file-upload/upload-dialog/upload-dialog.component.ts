import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UploadService } from '../../../../services/upload.service';
import { SocketService } from '../../../../services/socket.service';

@Component({
	selector: 'app-upload-dialog',
	templateUrl: './upload-dialog.component.html',
	styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
	@ViewChild('file') file;

	public files: Set<File> = new Set();

	canBeClosed: boolean;
	primaryButtonText: string;
	showCancelButton: boolean;
	uploading: boolean;
	uploadSuccessful: boolean;

	constructor(
      private dialogRef: MatDialogRef<UploadDialogComponent>,
      private uploadService: UploadService,
      private socketSv: SocketService
      ) { }

	ngOnInit(): void {
		this.canBeClosed = true;
		this.showCancelButton = true;
		this.uploading = false;
		this.uploadSuccessful = false;
    this.socketSv.errors.subscribe(next => 
        console.log(next.err));
    this.socketSv.updateCounters();
	}

	addFiles(): void {
		this.file.nativeElement.click();
	}

	onFilesAdded(): void {
		const files: { [key: string]: File } = this.file.nativeElement.files;

		for (const key in files) {
			if (!isNaN(parseInt(key, 10))) {
				this.files.add(files[key]);
			}
		}
	}

	closeDialog(): void {
		this.uploadService.upload(this.files);
	}
}

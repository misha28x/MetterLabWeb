import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UploadService } from '../../../../services/upload.service';

@Component({
	selector: 'app-upload-dialog',
	templateUrl: './upload-dialog.component.html',
	styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
	@ViewChild('file') file;

	public files: Set<File> = new Set();

	progress;
	canBeClosed: boolean;
	primaryButtonText: string;
	showCancelButton: boolean;
	uploading: boolean;
	uploadSuccessful: boolean;

	constructor(private dialogRef: MatDialogRef<UploadDialogComponent>, private uploadService: UploadService) { }

	ngOnInit(): void {
		this.canBeClosed = true;
		this.primaryButtonText = 'Upload';
		this.showCancelButton = true;
		this.uploading = false;
		this.uploadSuccessful = false;
	}

	addFiles(): void {
		this.file.nativeElement.click();
	}

	onFilesAdded(event): void {
		console.log(event.target.files);
		const files: { [key: string]: File } = this.file.nativeElement.files;

		for (let key in files) {
			if (!isNaN(parseInt(key, 10))) {
				this.files.add(files[key]);
			}
		}
	}

	closeDialog(): void {
		this.uploadService.upload(this.files);
	// 	if (this.uploadSuccessful) {
	// 		return this.dialogRef.close();
	// 	}

	// 	this.uploading = true;

	// 	this.progress = this.uploadService.upload(this.files);

	// 	const allProgressObservables = [];

	// 	this.primaryButtonText = 'Finish';

	// 	this.canBeClosed = false;
	// 	this.dialogRef.disableClose = true;

	// 	this.showCancelButton = false;

	// 	forkJoin(allProgressObservables).subscribe(end => {
	// 		this.canBeClosed = true;
	// 		this.dialogRef.disableClose = false;
	// 		this.uploadSuccessful = true;
	// 		this.uploading = false;
	// 	});
	}
}

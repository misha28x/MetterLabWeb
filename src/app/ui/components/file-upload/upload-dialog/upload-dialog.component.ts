import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { first } from 'rxjs/operators';

import { UploadService } from '../../../../services/upload.service';
import { SocketService } from '../../../../services/socket.service';

@Component({
	selector: 'app-upload-dialog',
	templateUrl: './upload-dialog.component.html',
	styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
	@ViewChild('file', { static: false }) file;

	public files: Set<File> = new Set();

  title: string;
  errorList: string[];
  downloaded: number;
	uploading: boolean;
  uploadedSuccesfully: boolean;
	
	constructor(
      private dialogRef: MatDialogRef<UploadDialogComponent>,
      private uploadService: UploadService,
      private socketSv: SocketService
    ) { }

	ngOnInit(): void {
		this.uploading = false;
    this.uploadedSuccesfully = false;
    this.title = 'Завантаження архіву';
    this.errorList = [];
    this.downloaded = 0;
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

	uploadFiles(): void {
    this.uploading = true;
    this.title = 'Іде завантаження';
		this.uploadService.upload(this.files);
    
    const firstFile = this.socketSv.files.pipe(first());

    firstFile.subscribe(() => {
      this.title = 'Завантаження завершено';
      this.uploading = false;
      this.uploadedSuccesfully = true;
      this.dialogRef.updateSize('60%', '80%');
    });

    this.socketSv.files.subscribe((next: any) => {
      if (next.hasOwnProperty('err')) {
        this.errorList.push(next.err);
      } else {
        this.downloaded++;
      }
    });
	}
}

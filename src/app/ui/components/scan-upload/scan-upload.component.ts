import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { UploadService } from '../../../services/upload.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-scan-upload',
  templateUrl: './scan-upload.component.html',
  styleUrls: ['./scan-upload.component.scss']
})
export class ScanUploadComponent implements OnInit {
  @ViewChild('file') file;

  public files: Set<File> = new Set();

  title: string;
  errorList: string[];
  downloaded: number;
  uploading: boolean;
  uploadedSuccesfully: boolean;

  constructor(
    private dialogRef: MatDialogRef<ScanUploadComponent>,
    private uploadService: UploadService,
    private socketSv: SocketService,
    @Inject(MAT_DIALOG_DATA) public verNumber: any
  ) { }

  ngOnInit(): void {
    this.uploading = false;
    this.uploadedSuccesfully = false;
    this.title = 'Завантаження скану документу';
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
    
    this.uploadService.uploadScan(this.files.values().next().value, this.verNumber.id).subscribe(() => {
      this.title = 'Завантаження завершено';
      this.uploading = false;
      this.uploadedSuccesfully = true;
      this.dialogRef.updateSize('60%', '30%');
    });
  }
}

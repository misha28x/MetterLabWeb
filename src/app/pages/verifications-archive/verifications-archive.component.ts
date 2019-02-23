import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { DetailViewService } from '../../services/detail-view.service';

import { ScanUploadComponent } from '../../ui/components/scan-upload';
import { SelectDialogComponent } from '../../ui/components/select-dialog';

@Component({
  selector: 'app-verifications-archive',
  templateUrl: './verifications-archive.component.html',
  styleUrls: ['./verifications-archive.component.scss']
})
export class PageVerificationsArchiveComponent implements OnInit {

	verificationsArchive: Observable<any[]>;

  constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService) { 
    this.sourceSv.fetchArchive();
    this.verificationsArchive = this.sourceSv.getArchive();
  }

  ngOnInit(): void { }

  detailView(id: any): void {
    this.detailSv.addVerification(id);
  }

  editProvider(id: string): void {
    const ref = this.dialog.open(SelectDialogComponent);

    ref.afterClosed().subscribe(data => )
  }

  addScan(id: string): void {
    this.dialog.open(ScanUploadComponent, {
      data: { id: id }
    });
  }
}

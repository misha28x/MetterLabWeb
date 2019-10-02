import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { filter, switchMap, tap } from 'rxjs/operators';

import { DataService } from '../../../services/data.service';
import { SourceService } from '../../../services/source.service';
import { ProvidersService } from '../../../services/providers.service';
import { DetailViewService } from '../../../services/detail-view.service';
import { VerificationService } from '../../../services/verification.service';
import { DeleteDialogComponent } from '../../../ui/components/delete-dialog';

interface DialogData {
  taskId: string;
  unresolved: boolean;
}

@Component({
  selector: 'app-tasl-list-view-dialog',
  templateUrl: './tasl-list-view-dialog.component.html',
  styleUrls: ['./tasl-list-view-dialog.component.scss']
})
export class TaslListViewDialogComponent implements OnInit {
  private url: string;
  taskList: Observable<any[]>;

  constructor(
    public providersSv: ProvidersService,
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<TaslListViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.data.unresolved) {
      this.url = 'http://localhost:3000/api/stations-tasks/unresolved/' + this.data.taskId;
    } else {
      this.url = 'http://localhost:3000/api/stations-tasks/tasks/' + this.data.taskId;
    }

    this.updateData();
  }

  updateData(): void {
    this.taskList = this.dataSv.getData(this.url);
  }

  rejectVerification(id: number): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.verificationSv.rejectVerification(id, res, this.data.taskId))
      )
      .subscribe(() => this.updateData());
  }

  deleteFromTask(verifId: string): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'повірку з завдання'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.verificationSv.deleteFromTask(verifId, this.data.taskId).subscribe(() => this.updateData());
      }
    });
  }

  checkForDuplicate(verification: any): void {
    this.verificationSv.addVerification(verification);
  }

  clientInaccesable(id: any): void {
    this.verificationSv.clientInaccessible(id).subscribe(() => this.updateData());
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { DataService } from '../../../services/data.service';
import { SourceService } from '../../../services/source.service';
import { DetailViewService } from '../../../services/detail-view.service';
import { VerificationService } from '../../../services/verification.service';
import { DeleteDialogComponent } from '../../../ui/components/delete-dialog';

@Component({
	selector: 'app-tasl-list-view-dialog',
	templateUrl: './tasl-list-view-dialog.component.html',
	styleUrls: ['./tasl-list-view-dialog.component.scss']
})
export class TaslListViewDialogComponent implements OnInit {

	taskList: Observable<any[]>;
	private url: string;

	constructor(
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verifSv: VerificationService,
    private dialogRef: MatDialogRef<TaslListViewDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public idTask: number
	) { }

	ngOnInit(): void {
    this.updateData();
  }

  cancelTask(id: string): void {
    this.dataSv.getData('http://134.209.243.90:3000/api/stations-tasks/delete/' + id).subscribe();
  }
  
  rowStyle(date: string, status: string): any {
    return {
      'table-error': this.isFailed(date, status),
      'table-success': !this.isFailed(date, status)
    };
  } 

  isFailed(date: string, status: string): boolean {
    if (new Date(date) > new Date || status.includes('Проведено повірку')) {
      return false;
    }
    return true;
  }
  updateData(): void {
    this.url = 'http://134.209.243.90:3000/api/stations-tasks/tasks/' + this.idTask;

    this.taskList = this.dataSv.getData(this.url);
  }

  rejectVerification(id: number): void {
    this.verifSv.rejectVerification(id).subscribe(() => {
      this.updateData();
    });
  }

  deleteFromTask(verifId: string): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'повірку з завдання'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.verifSv.deleteFromTask(verifId, this.idTask).subscribe(() => this.updateData());
      }
    });
  }

  cancellEmployee(id: number): void {
    this.verifSv.cancellEmployee(id).subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: any): void {
    this.verifSv.addVerification(verification);
  }

  clientInaccesable(id: any): void {
    this.verifSv.clientInaccesable(id).subscribe(() => this.updateData());
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id);
  }
}

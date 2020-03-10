import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { filter, switchMap } from 'rxjs/operators';

import { DataService } from '../../services/data.service';
import { SourceService } from '../../services/source.service';
import { VerificationDTO } from '../../interfaces/verifications';
import { DetailViewService } from '../../services/detail-view.service';
import { ProvidersService } from '../../services/providers.service';
import { VerificationService } from '../../services/verification.service';
import { SelectDialogComponent } from '../../ui/components/select-dialog';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class PageLabRequestsComponent implements OnInit {
  labRequests: Observable<any[]>;
  selectedData: any[];
  employee: string;

  columnsToDisplay: string[];

  constructor(
    public providersSv: ProvidersService,
    private http: HttpClient,
    private dialog: MatDialog,
    private dataSv: DataService,
    private sourceSv: SourceService,
    private detailSv: DetailViewService,
    private verificationSv: VerificationService
  ) {
    this.sourceSv.fetchLabRequest();
  }

  ngOnInit(): void {
    this.labRequests = this.sourceSv.getLab();
  }

  updateData(): void {
    this.sourceSv.fetchLabRequest();
  }

  detailView(id: number): void {
    this.detailSv.addVerification(id).subscribe(() => this.updateData());
  }

  editProvider(id: string, provider: string, type: string): void {
    const ref = this.dialog.open(SelectDialogComponent, {
      data: {
        provider: provider,
        type: type
      }
    });

    ref.afterClosed().subscribe(data => {
      if (data) {
        const providerUrl =
          'http://165.22.83.21:3000/api/verifications-archive/service-provider/' + id;

        this.http
          .post(providerUrl, { provider: data.provider, type: data.type })
          .subscribe(() => this.update());
      }
    });
  }

  update(): void {
    this.sourceSv.fetchLabRequest();
  }

  sendVerif(): void {
    forkJoin(
      this.selectedData.map((ver: VerificationDTO) =>
        this.verificationSv.sendVerif(ver.applicationNumber)
      )
    ).subscribe(() => this.updateData());
  }

  rejectVerification(id: number): void {
    this.verificationSv
      .openRejectDialog()
      .pipe(
        filter(res => !!res),
        switchMap(res => this.verificationSv.rejectVerification(id, res))
      )
      .subscribe(() => this.updateData());
  }

  deleteVerification(id: number): void {
    this.verificationSv
      .openDeleteDialog()
      .pipe(
        filter(res => !!res),
        switchMap(() => this.verificationSv.deleteVerification(id))
      )
      .subscribe(() => this.updateData());
  }

  checkForDuplicate(verification: VerificationDTO): void {
    this.verificationSv.addVerification(verification);
  }

  onChange(data: any): void {
    this.selectedData = data;
  }
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

import { VerificationDTO } from '../interfaces/verifications';
import { DetailViewDialogComponent } from '../ui/components/detail-view-dialog/detail-view-dialog.component';

const verUrl = 'http://165.22.83.21:3000/api/verifications-archive/single/';
const addressUrl = 'http://165.22.83.21:3000/api/new-verifications/all/address';

@Injectable({
  providedIn: 'root'
})
export class DetailViewService {
  private verificationSource$ = new Subject<VerificationDTO>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  addVerification(id: any): Observable<any> {
    return this.http
      .get<VerificationDTO>(verUrl + id)
      .pipe(switchMap(ver => this.openDialog(ver).afterClosed()));
  }

  getVerification(): Observable<VerificationDTO> {
    return this.verificationAdded$;
  }

  getAddresses(): Observable<any> {
    return this.http.get(addressUrl);
  }

  openDialog(ver: VerificationDTO): MatDialogRef<DetailViewDialogComponent> {
    const ref = this.dialog.open(DetailViewDialogComponent, {
      height: '75%',
      width: '800px',
      data: {
        verification: ver,
        address: this.getAddresses()
      }
    });

    return ref;
  }
}

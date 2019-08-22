import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap   } from 'rxjs/operators';

import { Verification } from '../interfaces/verifications';
import { DeleteDialogComponent } from '../ui/components/delete-dialog';
import { RejectionDialogComponent } from '../ui/components/rejection-dialog';

const employeeCancelUrl = 'http://165.22.83.21:3000/api/new-verifications/cancel-employee/';
const duplicateUrl = 'http://165.22.83.21:3000/api/new-verifications/duplicate';
const archiveUrl = 'http://165.22.83.21:3000/api/verifications-archive';
const deleteFromTask = 'http://165.22.83.21:3000/api/stations-tasks/delete/';
const rejectUrl = 'http://165.22.83.21:3000/api/new-verifications/rejected/';
const editUrl = 'http://165.22.83.21:3000/api/verifications-archive/edit/';
const protocolUrl = 'http://165.22.83.21:3000/api/verications-protocols';
const deleteUrl = 'http://165.22.83.21:3000/api/new-verifications/';
const sendVerif = 'http://165.22.83.21:3000/api/lab-requests/send/';
const issueDate = '165.22.83.21:3000/api/verifications-archive/issue/';
const revertURL = 'http://165.22.83.21:3000/api/rejected-verification/back';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  public addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
  }

  public getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }

  public deleteFromTask(id: any, idTask: any): Observable<any> {
    return this.http.post(deleteFromTask + '' + id, { id_task: idTask });
  }

  public rejectVerification(id: any, reason: string): Observable<any> {
    return this.http.post(rejectUrl + id, { reason: reason });
  }

  public deleteVerification(id: any): Observable<any> {
    return this.http.delete(deleteUrl + id);
  }

  public checkForDuplicate(address: any): Observable<any> {
    return this.http.post(duplicateUrl, address);
  }

  public cancelEmployee(id: any): Observable<any> {
    return this.http.get(employeeCancelUrl + id);
  }

  public updateVerification(id: any, verification: Verification): Observable<any> {
    return this.http.put(editUrl + id, verification);
  }

  public revertVerif(id: any): Observable<any> {
    return this.http.put(revertURL, { id: id });
  }

  public clientInaccessible(id: any): Observable<any> {
    return this.http.put(`${archiveUrl}/ndz/${id}`, {});
  }

  public sendVerif(id: any): Observable<any> {
    return this.http.get(sendVerif + id);
  }

  public deleteProtocol(id: any): Observable<any> {
    const ref = this.dialog.open(DeleteDialogComponent, { data: 'протокол' });

    return ref.afterClosed().pipe(
      filter(res => !!res),
      switchMap(() => this.http.delete(`${protocolUrl}/delete/${id}`))
    );
  }

  public setIssueDate(id: any, date: string): Observable<any> {
    return this.http.post(issueDate + id, { issueDate: date });
  }

  public openDeleteDialog(): Observable<any> {
    return this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'повірку'
    }).afterClosed();
  }

  public openRejectDialog(): Observable<any> {
    return this.dialog.open(RejectionDialogComponent, {
      minWidth: '450px',
      maxWidth: '95%',
      data: 'повірку'
    }).afterClosed();
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { from, Observable, Subject } from 'rxjs';

import { Verification } from '../interfaces/verifications';
import { DeleteDialogComponent } from '../ui/components/delete-dialog';
import { RejectionDialogComponent } from '../ui/components/rejection-dialog';

const employeeCancelUrl = 'http://134.209.243.90:3000/api/new-verifications/cancel-employee/';
const duplicateUrl = 'http://134.209.243.90:3000/api/new-verifications/duplicate';
const archiveUrl = 'http://134.209.243.90:3000/api/verifications-archive';
const deleteFromTask = 'http://134.209.243.90:3000/api/stations-tasks/delete/';
const rejectUrl = 'http://134.209.243.90:3000/api/new-verifications/rejected/';
const editUrl = 'http://134.209.243.90:3000/api/verifications-archive/edit/';
const protocolUrl = 'http://134.209.243.90:3000/api/verications-protocols';
const deleteUrl = 'http://134.209.243.90:3000/api/new-verifications/';
const sendVerif = 'http://134.209.243.90:3000/api/lab-requests/send/';
const issueDate = '134.209.243.90:3000/api/verifications-archive/issue/';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  public addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
  }

  public getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }

  public deleteFromTask(id: any, idTask: any): Observable<any> {
    return this.http.post(deleteFromTask + '' + id, { id_task: idTask });
  }

  public rejectVerification(id: any): Observable<any> {
    const ref = this.dialog.open(RejectionDialogComponent);

    return Observable.create((observer)=> {
      ref.afterClosed().subscribe(res => {
        if (res) {
          this.http.post(rejectUrl + id, { reason: res }).subscribe(val => observer.next(val));
        }
      });
    });
  }

  public deleteVerification(id: any): Observable<any> {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'повірку'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        return this.http.delete(deleteUrl + id);
      }
    });

    return from([false]);
  }

  public checkForDuplicate(address: any): Observable<any> {
    return this.http.post(duplicateUrl, address);
  }

  public cancellEmployee(id: any): Observable<any> {
    return this.http.get(employeeCancelUrl + id);
  }

  public updateVerification(id: any, verification: Verification): Observable<any> {
    console.log(editUrl + id, verification);
    return this.http.put(editUrl + id, verification);
  }

  public clientInaccesable(id: any): Observable<any> {
    return this.http.put(`${archiveUrl}/ndz/${id}`, {});
  }

  public sendVerif(id: any): Observable<any> {
    return this.http.get(sendVerif + id);
  }

  public deleteProtocol(id: any): Observable<any> {
    const ref = this.dialog.open(DeleteDialogComponent, { data: 'протокол' });

    ref.afterClosed().subscribe(res => {
      if (res === 'delete') {
        return this.http.delete(`${protocolUrl}/delete/${id}`);
      }
    });

    return from([false]);
  }

  public setIssueDate(id: any, date: string): Observable<any> {
    return this.http.post(issueDate + id, { issueDate : date });
  }
}

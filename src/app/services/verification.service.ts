import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, from } from 'rxjs';
import { MatDialog } from '@angular/material';

import { Verification } from '../interfaces/verifications';
import { DeleteDialogComponent } from '../ui/components/delete-dialog';
import { RejectionDialogComponent } from '../ui/components/rejection-dialog';

const employeeCancelUrl = 'http://localhost:3000/api/new-verifications/cancel-employee/';
const duplicateUrl = 'http://localhost:3000/api/new-verifications/duplicate';
const archiveUrl = 'http://localhost:3000/api/verifications-archive';
const deleteFromTask = 'http://localhost:3000/api/task-planing/delete/';
const rejectUrl = 'http://localhost:3000/api/new-verifications/rejected/';
const editUrl = 'http://localhost:3000/api/verifications-archive/edit/';
const protocolUrl = 'http://localhost:3000/api/verications-protocols';
const deleteUrl = 'http://localhost:3000/api/new-verifications/';

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
    console.log({ id: id, task: idTask });
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'повірку з завдання'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        return this.http.post(deleteFromTask + id, { id_task: idTask });
      }
    });

    return from([false]);
  }

  public rejectVerification(id: any): Observable<any> {
    const ref = this.dialog.open(RejectionDialogComponent);

    ref.afterClosed().subscribe(res => {
      if (res) {
        return this.http.post(rejectUrl + id, { reason: res });
      }
    });

    return from([false]);
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
    return this.http.put(editUrl + id, verification);
  }

  public clientInaccesable(id: any): Observable<any> {
    return this.http.put(`${archiveUrl}/ndz/${id}`, {});
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
}

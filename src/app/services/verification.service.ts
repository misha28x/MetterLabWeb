import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Verification } from '../interfaces/verifications';
import { DeleteDialogComponent } from '../ui/components/delete-dialog';
import { RejectionDialogComponent } from '../ui/components/rejection-dialog';
import { AddToTaskComponent } from '../pages/task-planing/add-to-task/add-to-task.component';

const createUrl = 'http://165.22.83.21:3000/api/new-verifications';
const addToTask = 'http://165.22.83.21:3000/api/task-planing/add-to-task';
const duplicateUrl = 'http://165.22.83.21:3000/api/new-verifications/duplicate';
const archiveUrl = 'http://165.22.83.21:3000/api/verifications-archive';
const deleteFromTask = 'http://165.22.83.21:3000/api/stations-tasks/delete/';
const rejectUrl = 'http://165.22.83.21:3000/api/new-verifications/rejected/';
const editUrl = 'http://165.22.83.21:3000/api/verifications-archive/edit/';
const protocolUrl = 'http://165.22.83.21:3000/api/verications-protocols';
const deleteUrl = 'http://165.22.83.21:3000/api/new-verifications/';
const sendVerif = 'http://165.22.83.21:3000/api/lab-requests/send/';
const issueDate = 'http://165.22.83.21:3000/api/verifications-archive/issue/';
const revertUrl = 'http://165.22.83.21:3000/api/rejected-verification/back';
const revertProviderUrl =
  'http://165.22.83.21:3000/api/rejected-verification/provider/back';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
  }

  createVerification(verification: Verification): Observable<Object> {
    return this.http.post(createUrl, verification);
  }

  getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }

  deleteFromTask(id: any, taskId: any): Observable<any> {
    return this.http.post(deleteFromTask + '' + id, { taskId: taskId });
  }

  rejectVerification(id: any, reason: string, taskId?: string): Observable<any> {
    return this.http.post(rejectUrl + id, { reason: reason, id_task: taskId });
  }

  deleteVerification(id: any): Observable<any> {
    return this.http.delete(deleteUrl + id);
  }

  checkForDuplicate(address: any): Observable<any> {
    return this.http.post(duplicateUrl, address);
  }

  addVerificationToTask(id: string, taskId: string): Observable<any> {
    return this.http.put(`${addToTask}/${id}/${taskId}`, {});
  }

  updateVerification(id: any, verification: Verification): Observable<any> {
    return this.http.put(editUrl + id, verification);
  }

  revertVerif(id: any): Observable<any> {
    return this.http.put(revertUrl, { id: id });
  }

  revertVerifProvider(id: any): Observable<any> {
    return this.http.put(revertProviderUrl, { id: id });
  }

  clientInaccessible(id: any): Observable<any> {
    return this.http.put(`${archiveUrl}/ndz/${id}`, {});
  }

  sendVerif(id: any): Observable<any> {
    return this.http.get(sendVerif + id);
  }

  deleteProtocol(id: any, bbi: string): Observable<any> {
    const ref = this.dialog.open(DeleteDialogComponent, { data: 'протокол' });

    return ref.afterClosed().pipe(
      filter(res => !!res),
      switchMap(() => this.http.delete(`${protocolUrl}/delete/${id}/${bbi}`))
    );
  }

  setIssueDate(id: any, date: string): Observable<any> {
    return this.http.post(issueDate + id, { issueDate: date });
  }

  openTaskSelection(): Observable<string> {
    const ref = this.dialog.open(AddToTaskComponent, {
      width: '80%'
    });

    return ref.afterClosed().pipe(filter(val => !!val));
  }

  openDeleteDialog(): Observable<any> {
    return this.dialog
      .open(DeleteDialogComponent, {
        minWidth: '600px',
        data: 'повірку'
      })
      .afterClosed();
  }

  openRejectDialog(): Observable<any> {
    return this.dialog
      .open(RejectionDialogComponent, {
        minWidth: '450px',
        maxWidth: '95%',
        data: 'повірку'
      })
      .afterClosed();
  }
}

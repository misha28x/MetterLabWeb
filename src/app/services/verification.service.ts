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

  public addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
  }

  public createVerification(verification: Verification): Observable<Object> {
    return this.http.post(createUrl, verification);
  }

  public getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }

  public deleteFromTask(id: any, taskId: any): Observable<any> {
    return this.http.post(deleteFromTask + '' + id, { taskId: taskId });
  }

  public rejectVerification(id: any, reason: string, taskId?: string): Observable<any> {
    return this.http.post(rejectUrl + id, { reason: reason, id_task: taskId });
  }

  public deleteVerification(id: any): Observable<any> {
    return this.http.delete(deleteUrl + id);
  }

  public checkForDuplicate(address: any): Observable<any> {
    return this.http.post(duplicateUrl, address);
  }

  public addVerificationToTask(id: string, taskId: string): Observable<any> {
    return this.http.put(`${addToTask}/${id}/${taskId}`, {});
  }

  public updateVerification(id: any, verification: Verification): Observable<any> {
    return this.http.put(editUrl + id, verification);
  }

  public revertVerif(id: any): Observable<any> {
    return this.http.put(revertUrl, { id: id });
  }

  public revertVerifProvider(id: any): Observable<any> {
    return this.http.put(revertProviderUrl, { id: id });
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

  public openTaskSelection(): Observable<string> {
    const ref = this.dialog.open(AddToTaskComponent, {
      width: '80%'
    });

    return ref.afterClosed().pipe(filter(val => !!val));
  }

  public openDeleteDialog(): Observable<any> {
    return this.dialog
      .open(DeleteDialogComponent, {
        minWidth: '600px',
        data: 'повірку'
      })
      .afterClosed();
  }

  public openRejectDialog(): Observable<any> {
    return this.dialog
      .open(RejectionDialogComponent, {
        minWidth: '450px',
        maxWidth: '95%',
        data: 'повірку'
      })
      .afterClosed();
  }
}

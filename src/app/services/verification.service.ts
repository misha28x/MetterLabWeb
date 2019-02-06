import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Verification } from '../interfaces/verifications';

const employeeCancelUrl = 'http://localhost:3000/api/new-verifications/cancel-employee/';
const duplicateUrl = 'http://localhost:3000/api/new-verifications/duplicate';
const rejectUrl = 'http://localhost:3000/api/new-verifications/reject/';
const deleteUrl = 'http://localhost:3000/api/new-verifications/delete/';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(private http: HttpClient) { }

  public addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
  }

  public getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }

  public rejectVerification(id: number): Observable<any> {
    return this.http.get(rejectUrl + id);
  }

  public deleteVerification(id: number): Observable<any> {
    return this.http.delete(deleteUrl + id);
  }

  public checkForDuplicate(address: any): Observable<any> {
    return this.http.post(duplicateUrl, address);
  }

  public cancellEmployee(id: number): Observable<any> {
    return this.http.get(employeeCancelUrl + id);
  }
}

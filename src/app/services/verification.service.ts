import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Verification } from '../interfaces/verifications';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor() { }

  public addVerification(verification: Verification): void {
    this.verificationSource$.next(verification);
    console.log(verification);
  }

  public getVerification(): Observable<Verification> {
    console.log(this.verificationAdded$);
    return this.verificationAdded$;
  }
}
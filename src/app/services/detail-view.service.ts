import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Verification } from '../interfaces/verifications';

const verUrl = 'http://localhost:3000/api/verifications-archive/';

@Injectable({
  providedIn: 'root'
})
export class DetailViewService {
  private verificationSource$ = new Subject<Verification>();
  private verificationAdded$ = this.verificationSource$.asObservable();

  constructor(private http: HttpClient) { }

  addVerification(id: any): void {
    this.http.get(verUrl + id)
    .subscribe((ver: Verification) => {
      this.verificationSource$.next(ver);
    });
  }

  getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }
}

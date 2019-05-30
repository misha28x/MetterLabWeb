import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Verification } from '../interfaces/verifications';

const verUrl = 'http://134.209.243.90:3000/api/verifications-archive/single/';

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
      console.log({
        id: id,
        ver: ver
      });
      this.verificationSource$.next(ver);
    });
  }

  getVerification(): Observable<Verification> {
    return this.verificationAdded$;
  }
}

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ClientInfo } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private dataSource$: Subject<ClientInfo>;

  constructor(private http: HttpClient) {
    this.dataSource$ = new Subject();
  }

  getClientData(): Observable<ClientInfo> {
    return this.dataSource$.asObservable();
  }

  fetchClientData(id: any): void {
    const URL = `http://165.22.83.21:3000/api/verifications-archive/client/${id}`;

    this.http.get(URL).subscribe(res => this.dataSource$.next(res[0]));
  }

  updateClientInfo(id: any, info: ClientInfo): void {
    const URL = `http://165.22.83.21:3000/api/verifications-archive/client/${id}`;

    this.http.put(URL, info).subscribe();
  }

  getVerificationData(verificationNumber: string): Observable<any> {
    const URL = `http://165.22.83.21:3000/api/status/verification/${verificationNumber}`;

    return this.http.get(URL);
  }

  getCounterData(counterNumber: string): Observable<any> {
    const URL = `http://165.22.83.21:3000/api/status/counter/${counterNumber}`;

    return this.http.get(URL);
  }
}

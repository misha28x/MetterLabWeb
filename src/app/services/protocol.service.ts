import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import { Protocol } from '../interfaces/protocol';
import { User } from '../interfaces/user';

const protocolUrl = 'http://165.22.83.21:3000/api/verications-protocols/';
const rejectUrl = 'http://165.22.83.21:3000/api/verications-protocols/reject/';
const unsuitableUrl = 'http://165.22.83.21:3000/api/verications-protocols/unsuitable/';
const acceptUrl = 'http://165.22.83.21:3000/api/verications-protocols/accept/';

const returnUrl = 'http://165.22.83.21:3000/api/rejected-protocols/back/';
const recycleUrl = 'http://165.22.83.21:3000/api/rejected-protocols/recycle/';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private protocolSource$ = new Subject<Protocol>();
  private protocolAdded$ = this.protocolSource$.asObservable();
  private userId: string;

  constructor(private http: HttpClient, private store: Store<User>) {
    this.store.pipe(select('permission')).subscribe((_user: User) => {
      this.userId = _user.userId;
    });
  }

  public addProtocol(protocol: Protocol): void {
    this.protocolSource$.next(protocol);
  }

  public getProtocol(): Observable<Protocol> {
    return this.protocolAdded$;
  }

  public updateProtocol(id: any, data: Protocol): Observable<any> {
    return this.http.put(protocolUrl + data.counterNumber, { ...data });
  }

  public acceptProtocol(id: any): Observable<any> {
    return this.http.get(acceptUrl + id);
  }

  public rejectProtocol(id: any): Observable<any> {
    return this.http.get(rejectUrl + id);
  }

  public unsuitableProtocol(id: any): Observable<any> {
    return this.http.get(unsuitableUrl + id);
  }

  returnProtocol(id: string): Observable<Object> {
    return this.http.put(returnUrl + id, {});
  }

  recycleProtocol(id: string): Observable<Object> {
    return this.http.put(recycleUrl + id, {});
  }

  downloadDoc(protocolNumber: string): void {
    const docUrl = `http://165.22.83.21:3000/api/report-formation/doc/${protocolNumber}/${this.userId}`;
    const viewerUrl = 'https://docs.google.com/viewer?url=';

    window.open(`${viewerUrl}${docUrl}`);
  }
}

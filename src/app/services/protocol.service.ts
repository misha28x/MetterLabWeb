import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import { Protocol } from '../interfaces/protocol';
import { User } from '../interfaces/user';

const protocolUrl = 'http://165.22.83.21:3000/api/verications-protocols/';
const rejectUrl = 'http://165.22.83.21:3000/api/verications-protocols/reject/';
const acceptUrl = 'http://165.22.83.21:3000/api/verications-protocols/accept/';

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

  public upladteProtocol(id: any, data: Protocol): Observable<any> {
    return this.http.put(protocolUrl + data.counterNumber, { ...data });
  }

  public acceptProtocol(id: any): Observable<any> {
    return this.http.get(acceptUrl + id);
  }

  public rejectProtocol(id: any): Observable<any> {
    return this.http.get(rejectUrl + id);
  }

  downloadDoc(protocolNumber: string): void {
    window.open(`http://165.22.83.21:3000/api/report-formation/doc/${protocolNumber}/${this.userId}`);
  }
}

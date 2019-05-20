import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Protocol } from '../interfaces/protocol';

const protocolUrl = 'http://134.209.243.90:3000/api/verications-protocols/';
const rejectUrl = 'http://134.209.243.90:3000/api/verications-protocols/reject/';
const acceptUrl = 'http://134.209.243.90:3000/api/verications-protocols/accept/';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private protocolSource$ = new Subject<Protocol>();
  private protocolAdded$ = this.protocolSource$.asObservable();

  constructor(private http: HttpClient) { }

  public addProtocol(protocol: Protocol): void {
    console.log(protocol);
    this.protocolSource$.next(protocol);
  }

  public getProtocol(): Observable<Protocol> {
    return this.protocolAdded$;
  } 

  public upladteProtocol(id: any, data: Protocol): Observable<any> {
    return this.http.post(protocolUrl + id, { protocol: data });
  }

  public acceptProtocol(id: any): Observable<any> {
    return this.http.get(acceptUrl + id);
  }

  public rejectProtocol(id: any): Observable<any> {
    return this.http.get(rejectUrl + id);
  }
}

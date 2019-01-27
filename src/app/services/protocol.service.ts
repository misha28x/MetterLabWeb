import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Protocol } from '../interfaces/protocol';

const protocolUrl = 'http//localhost:3000/api/verications-protocols/';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private protocolSource$ = new Subject<Protocol>();
  private protocolAdded$ = this.protocolSource$.asObservable();

  constructor(private http: HttpClient) { }

  public addProtocol(protocol: Protocol): void {
    this.protocolSource$.next(protocol);
  }

  public getProtocol(): Observable<Protocol> {
    return this.protocolAdded$;
  } 

  public upladteProtocol(id: number, data: Protocol): Observable<any> {
    return this.http.post(protocolUrl + id, { protocol: data });
  }
}

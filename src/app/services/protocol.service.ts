import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Protocol } from '../interfaces/protocol';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {
  private protocolSource$ = new Subject<Protocol>();
  private protocolAdded$ = this.protocolSource$.asObservable();

  constructor() { }

  public addProtocol(protocol: Protocol): void {
    this.protocolSource$.next(protocol);
  }

  public getProtocol(): Observable<Protocol> {
    return this.protocolAdded$;
  } 
}

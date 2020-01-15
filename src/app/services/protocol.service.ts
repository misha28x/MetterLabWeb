import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import printJs from 'print-js';
import { tap } from 'rxjs/operators';

import { Protocol } from '../interfaces/protocol';
import { IUser } from '../interfaces/user';
import { SourceService } from './source.service';

const protocolUrl = 'http://165.22.83.21:3000/api/verications-protocols';
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

  constructor(
    private http: HttpClient,
    private store: Store<IUser>,
    private sourceSv: SourceService
  ) {
    this.store.pipe(select('permission')).subscribe((_user: IUser) => {
      this.userId = _user.userId;
    });
  }

  public addProtocol(protocol: Protocol, status: string = ''): void {
    const updatedProcol = { ...protocol, status };
    this.protocolSource$.next(updatedProcol);
  }

  public getProtocol(): Observable<Protocol> {
    return this.protocolAdded$;
  }

  public updateProtocol(id: any, data: Protocol): Observable<any> {
    return this.http.put(`${protocolUrl}/${id}/${data.protocolNumber}`, { ...data }).pipe(
      tap(() => {
        this.sourceSv.fetchProtocols();
        this.sourceSv.fetchMetrologyProtocols();
        this.sourceSv.fetchRejectedProtocols();
      })
    );
  }

  public acceptProtocol(id: any): Observable<any> {
    return this.http.get(`${acceptUrl}${id}/${this.userId}`);
  }

  public rejectProtocol(id: any): Observable<any> {
    return this.http.get(rejectUrl + id);
  }

  public unsuitableProtocol(id: any): Observable<any> {
    return this.http.get(`${unsuitableUrl}${id}/${this.userId}`);
  }

  returnProtocol(id: string): Observable<Object> {
    return this.http.put(returnUrl + id, {});
  }

  recycleProtocol(id: string): Observable<Object> {
    return this.http.put(recycleUrl + id, {});
  }

  downloadDoc(counterNumber: string, bbi: string, mId: string = this.userId): void {
    const docUrl = `http://165.22.83.21:3000/api/report-formation/pdf/${counterNumber}/${bbi}/${mId}`;
    window.open(docUrl);
  }
}

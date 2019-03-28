import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '../interfaces/user';

let metrologyProtocolsUrl: string = 'http://localhost:3000/api/verications-protocols/metrology';
let rejectedProtocolsUrl: string = 'http://localhost:3000/api/rejected-protocols';
let failedTasksUrl: string = 'http://localhost:3000/api/stations-tasks/failed/1';
let newVerificationUrl: string = 'http://localhost:3000/api/new-verifications';
let rejectedVerif: string = 'http://localhost:3000/api/rejected-verification';
let ptocolsUrl: string = 'http://localhost:3000/api/verications-protocols';
let archiveUrl: string = 'http://localhost:3000/api/verifications-archive';
let stationTasksUrl: string = 'http://localhost:3000/api/stations-tasks';
let taskPlaningUrl: string = 'http://localhost:3000/api/task-planing';
let labUrl: string = 'http://localhost:3000/api/lab-requests';
// TODO:Rejected Verif

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private metrologyProtocolsSource$ = new BehaviorSubject([]);
  private rejectedProtocolsSource$ = new BehaviorSubject([]);
  private newVerificationSource$ = new BehaviorSubject([]);
  private rejectedVerifSource$ = new BehaviorSubject([]);
  private failedTasksSource$ = new BehaviorSubject([]);
  private stationTaskSource$ = new BehaviorSubject([]);
  private taskPlaningSource$ = new BehaviorSubject([]);
  private protocolsSource$ = new BehaviorSubject([]);
  private archiveSource$ = new BehaviorSubject([]);
  private labSource$ = new BehaviorSubject([]);

  private user: User;

  constructor(
    private http: HttpClient,
    private store: Store<User>
  ) {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
      
      metrologyProtocolsUrl += '/' + _user.createFor;
      rejectedProtocolsUrl += '/' + _user.createFor;
      failedTasksUrl += '/' + _user.createFor;
      newVerificationUrl += '/' + _user.createFor;
      rejectedVerif += '/' + _user.createFor;
      ptocolsUrl += '/' + _user.createFor;
      archiveUrl += '/' + _user.createFor;
      stationTasksUrl += '/' + _user.createFor;
      taskPlaningUrl += '/' + _user.createFor;
      labUrl += '/' + _user.createFor;
    });
  }

  fetchNewVerifications(): void {
    this.http.get(newVerificationUrl).subscribe((res: any) => this.newVerificationSource$.next(res));
  }

  fetchStationTasks(): void {
    this.http.get(stationTasksUrl).subscribe((res: any) => this.stationTaskSource$.next(res));
  }

  fetchTaskPlaning(): void {
    this.http.get(taskPlaningUrl).subscribe((res: any) => this.taskPlaningSource$.next(res));
  }

  fetchProtocols(): void {
    this.http.get(ptocolsUrl).subscribe((res: any) => this.protocolsSource$.next(res));
  }

  fetchMetrologyProtocols(): void {
    this.http.get(metrologyProtocolsUrl).subscribe((res: any) => this.metrologyProtocolsSource$.next(res));
  }

  fetchRejectedVerif(): void {
    this.http.get(rejectedVerif).subscribe((res: any) => this.rejectedVerifSource$.next(res));
  }

  fetchFailedTasks(): void {
    this.http.get(failedTasksUrl).subscribe((res: any) => this.failedTasksSource$.next(res));
  }

  fetchRejectedProtocols(): void {
    this.http.get(rejectedProtocolsUrl).subscribe((res: any) => this.rejectedProtocolsSource$.next(res));
  }

  fetchArchive(): void {
    this.http.get(archiveUrl).subscribe((res: any) => this.archiveSource$.next(res));
  }

  fetchLabRequest(): void {
    this.http.get(labUrl).subscribe((res: any) => this.labSource$.next(res));
  }

  getNewVerifications(): Observable<any> {
    return this.newVerificationSource$.asObservable();
  }

  getStationTasks(): Observable<any> {
    return this.stationTaskSource$.asObservable();
  }

  getTaskPlaning(): Observable<any> {
    return this.taskPlaningSource$.asObservable();
  }

  getProtocols(): Observable<any> {
    return this.protocolsSource$.asObservable();
  }
  
  getLab(): Observable<any> {
    return this.labSource$.asObservable();
  }
  
  getRejectedVerifications(): Observable<any> {
    return this.rejectedVerifSource$.asObservable();
  }

  getRejectedProtocols(): Observable<any> {
    return this.rejectedProtocolsSource$.asObservable();
  }

  getMetrologyProtocols(): Observable<any> {
    return this.metrologyProtocolsSource$.asObservable();
  }

  getFailedTasks(): Observable<any> {
    return this.failedTasksSource$.asObservable();
  }

  getArchive(): Observable<any> {
    return this.archiveSource$.asObservable();
  }
}

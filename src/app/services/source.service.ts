import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const metrologyProtocolsUrl = 'http://localhost:3000/api/verications-protocols/metrology';
const rejectedProtocolsUrl = 'http://localhost:3000/api/rejected-protocols';
const failedTasksUrl = 'http://localhost:3000/api/stations-tasks/failed/1';
const newVerificationUrl = 'http://localhost:3000/api/new-verifications';
const rejectedVerif = 'http://localhost:3000/api/rejected-verification';
const ptocolsUrl = 'http://localhost:3000/api/verications-protocols';
const archiveUrl = 'http://localhost:3000/api/verifications-archive';
const stationTasksUrl = 'http://localhost:3000/api/stations-tasks';
const taskPlaningUrl = 'http://localhost:3000/api/task-planing';
const labUrl = 'http://localhost:3000/api/lab-requests';
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

  constructor(private http: HttpClient) { }

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

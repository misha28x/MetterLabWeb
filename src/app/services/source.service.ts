import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

const newVerificationUrl = 'http://localhost:3000/api/new-verifications';
const ptocolsUrl = 'http://localhost:3000/api/verications-protocols';
const stationTasksUrl = 'http://localhost:3000/api/stations-tasks';
const taskPlaningUrl = 'http://localhost:3000/api/task-planing';
const labUrl = 'http://localhost:3000/api/lab-requests';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private newVerificationSource$ = new BehaviorSubject([]);
  private stationTaskSource$ = new BehaviorSubject([]);
  private taskPlaningSource$ = new BehaviorSubject([]);
  private protocolsSource$ = new BehaviorSubject([]);
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
}

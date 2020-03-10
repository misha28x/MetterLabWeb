import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { IUser } from '../interfaces/user';
import { StationTask } from '../interfaces/task';
import { VerificationAdapter } from '../models/verification';
import { Provider, ProvidersService } from './providers.service';
import { VerificationDTO } from '../interfaces/verifications';

const metrologyProtocolsUrl: string =
  'http://165.22.83.21:3000/api/verications-protocols/metrology/protocols';
const rejectedProtocolsUrl: string = 'http://165.22.83.21:3000/api/rejected-protocols';
const failedTasksUrl: string = 'http://165.22.83.21:3000/api/stations-tasks/failed/1';
const newVerificationUrl: string = 'http://165.22.83.21:3000/api/new-verifications';
const rejectedVerif: string = 'http://165.22.83.21:3000/api/rejected-verification';
const metrologyArchive: string = 'http://165.22.83.21:3000/api/metrology';
const ptocolsUrl: string = 'http://165.22.83.21:3000/api/verications-protocols';
const archiveUrl: string = 'http://165.22.83.21:3000/api/verifications-archive';
const stationTasksUrl: string = 'http://165.22.83.21:3000/api/stations-tasks';
const taskPlaningUrl: string = 'http://165.22.83.21:3000/api/task-planing';
const labUrl: string = 'http://165.22.83.21:3000/api/lab-requests';

const isMetrology = (permission: number): boolean => permission === 3 || permission === 5;

@Injectable()
export class SourceService {
  private metrologyProtocolsSource$ = new BehaviorSubject([]);
  private rejectedProtocolsSource$ = new BehaviorSubject([]);
  private metrologyArchiveSource$ = new BehaviorSubject([]);
  private newVerificationSource$ = new BehaviorSubject([]);
  private providerArchive$ = new BehaviorSubject([]);
  private rejectedVerifSource$ = new BehaviorSubject([]);
  private rejectedProviders$ = new BehaviorSubject([]);
  private failedTasksSource$ = new BehaviorSubject([]);
  private stationTaskSource$ = new BehaviorSubject([]);
  private taskPlaningSource$ = new BehaviorSubject([]);
  private protocolsSource$ = new BehaviorSubject([]);
  private archiveSource$ = new BehaviorSubject([]);
  private labSource$ = new BehaviorSubject([]);

  private user: IUser;

  private providers: Map<number, Provider>;

  constructor(
    private http: HttpClient,
    private store: Store<IUser>,
    private providersSv: ProvidersService
  ) {
    this.store.pipe(select('permission')).subscribe((_user: IUser) => {
      this.user = _user;

      if (isMetrology(_user.permission)) {
        this.fetchMetrologyProtocols();
        this.fetchRejectedProtocols();
        this.fetchMetrologyArchive();
      }
    });

    this.providers = this.initProviders(this.providersSv.providers);
  }

  fetchNewVerifications(): void {
    this.http
      .get(newVerificationUrl + '/' + this.user.serviceProvider)
      .subscribe((res: any) => this.newVerificationSource$.next(res));
  }

  fetchStationTasks(): void {
    this.http
      .get(stationTasksUrl + '/' + this.user.serviceProvider)
      .pipe(
        map((arr: StationTask[]) =>
          arr.sort((cur, next) => (cur.taskDate > next.taskDate ? -1 : 1))
        )
      )
      .subscribe((res: any) => this.stationTaskSource$.next(res));
  }

  fetchTaskPlaning(): void {
    this.http
      .get(taskPlaningUrl + '/' + this.user.serviceProvider)
      .pipe(
        map((res: VerificationDTO[]) =>
          res.map(dto => new VerificationAdapter(this.providers).adapt(dto))
        )
      )
      .subscribe((res: any) => this.taskPlaningSource$.next(res));
  }

  fetchProtocols(): void {
    this.http
      .get(ptocolsUrl + '/' + this.user.serviceProvider)
      .subscribe((res: any) => this.protocolsSource$.next(res));
  }

  fetchProvidersRejected(): void {
    this.http
      .get(`${rejectedVerif}/provider/${this.user.serviceProvider}`)
      .subscribe((res: any) => this.rejectedVerifSource$.next(res));
  }

  fetchProvidersArchive(): void {
    this.http
      .get(`${archiveUrl}/provider/${this.user.serviceProvider}`)
      .subscribe((res: any) => this.providerArchive$.next(res));
  }

  fetchMetrologyArchive(): void {
    this.http
      .get(`${metrologyArchive}/${this.user.createFor}`)
      .subscribe((res: any) => this.metrologyArchiveSource$.next(res));
  }

  fetchMetrologyProtocols(): void {
    this.http
      .get(`${metrologyProtocolsUrl}/${this.user.createFor}`)
      .pipe(
        map((protocols: any) =>
          protocols.map(protocol => {
            return {
              ...protocol
            };
          })
        )
      )
      .subscribe((res: any) => this.metrologyProtocolsSource$.next(res));
  }

  fetchRejectedVerif(): void {
    this.http
      .get(rejectedVerif + '/' + this.user.serviceProvider)
      .subscribe((res: any) => this.rejectedVerifSource$.next(res));
  }

  fetchProviderRejected(): void {
    this.http
      .get(`${rejectedVerif}/provider/${this.user.serviceProvider}`)
      .subscribe((res: Object[]) => this.rejectedProviders$.next(res));
  }

  fetchFailedTasks(): void {
    this.http
      .get(failedTasksUrl + '/' + this.user.serviceProvider)
      .subscribe((res: any) => this.failedTasksSource$.next(res));
  }

  fetchRejectedProtocols(): void {
    const url =
      this.user.permission === 5
        ? rejectedProtocolsUrl
        : `${rejectedProtocolsUrl}/${this.user.createFor}`;

    this.http.get(url).subscribe((res: any) => this.rejectedProtocolsSource$.next(res));
  }

  fetchArchive(): void {
    this.http
      .get(archiveUrl + '/' + this.user.serviceProvider)
      .pipe(
        map((res: VerificationDTO[]) =>
          res.map(dto => new VerificationAdapter(this.providers).adapt(dto))
        )
      )
      .subscribe((res: any) => this.archiveSource$.next(res));
  }

  fetchLabRequest(): void {
    this.http
      .get(labUrl + '/' + this.user.serviceProvider)
      .subscribe((res: any) => this.labSource$.next(res));
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

  getMetrolohyArchive(): Observable<any> {
    return this.metrologyArchiveSource$.asObservable();
  }

  getFailedTasks(): Observable<any> {
    return this.failedTasksSource$.asObservable();
  }

  getArchive(): Observable<any> {
    return this.archiveSource$.asObservable();
  }

  getProvidersArchive(): Observable<any> {
    return this.providerArchive$.asObservable();
  }

  getRejectedProvider(): Observable<Object[]> {
    return this.rejectedProviders$.asObservable();
  }

  private initProviders(providersArr: Provider[]): Map<number, Provider> {
    const resultMap = new Map<number, Provider>();

    for (const provider of providersArr) {
      resultMap.set(provider.id, provider);
    }

    return resultMap;
  }
}

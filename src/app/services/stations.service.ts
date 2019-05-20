import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Station } from '../interfaces/station';

const stationsUrl = 'http://134.209.243.90:3000/api/employees/stations';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private stationSource$ = new BehaviorSubject<Station[]>([]);

  constructor(private http: HttpClient) { }

  fetchStations(serviceProvider: string): void {
    this.http.get(`${stationsUrl}/${serviceProvider}`).subscribe( (res: any) => this.stationSource$.next(res) );
  }

  getStations(): Observable<any> {
    return this.stationSource$.asObservable();
  }

  // getStation(Station: Station): Observable<any> {
  //   return this.http.post(`${stationsUrl}/${Station.id}`, Station);
  // }

  getPermissions(): Observable<any> {
    return this.http.get('http://134.209.243.90:3000/api/Stations/permissions');
  }

  addStation(station: Station): Observable<any> {
    return this.http.post(stationsUrl, station);
  }

  editStation(station: Station): Observable<any> {
    return this.http.put(`${stationsUrl}/${station.stationNumber}`, station);
  }

  deleteStation(station: Station): Observable<any> {
    return this.http.delete(`${stationsUrl}/${station.stationNumber}`);
  }
}

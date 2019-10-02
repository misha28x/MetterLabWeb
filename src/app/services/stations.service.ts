import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Station } from '../interfaces/station';
import { ChangeStationNumberComponent } from '../ui/components/change-station-number/change-station-number.component';

const stationsUrl = 'http://localhost:3000/api/employees/stations';
const taskUrl = 'http://localhost:3000/api/stations-tasks';

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private stationSource$ = new BehaviorSubject<Station[]>([]);

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  fetchStations(serviceProvider: string): void {
    this.http
      .get(`${stationsUrl}/${serviceProvider}`)
      .subscribe((res: any) => this.stationSource$.next(res));
  }

  getStations(): Observable<any> {
    return this.stationSource$.asObservable();
  }

  getPermissions(): Observable<any> {
    return this.http.get('http://localhost:3000/api/Stations/permissions');
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

  changeStation(taskId: string, oldNumber: string): Observable<any> {
    const dialogData = {
      taskId,
      oldNumber,
      stations: this.getStations().pipe(map(stations => stations.map(station => station.stationNumber)))
    };

    this.fetchStations('80334');

    const dialogRef = this.dialog.open(ChangeStationNumberComponent, {
      width: '350px',
      data: dialogData
    });

    return dialogRef.afterClosed().pipe(
      filter(val => !!val),
      switchMap(stationNumber => this.http.put(`${taskUrl}/change/${taskId}`, { stationNumber }))
    );
  }
}

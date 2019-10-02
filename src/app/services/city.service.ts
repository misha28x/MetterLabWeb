import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { City } from '../interfaces/city';

const cityUrl = 'http://localhost:3000/api/employees/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citySource$ = new BehaviorSubject<City[]>([]);

  constructor(private http: HttpClient) {}

  fetchCities(): void {
    this.http.get(`${cityUrl}`).subscribe((res: any) => this.citySource$.next(res));
  }

  getCities(): Observable<any> {
    return this.citySource$.asObservable();
  }

  getPermissions(): Observable<any> {
    return this.http.get('http://localhost:3000/api/cityes/permissions');
  }

  addCity(city: City): Observable<any> {
    return this.http.post(cityUrl, city);
  }

  editCity(city: City): Observable<any> {
    return this.http.put(`${cityUrl}/${city.id}`, city);
  }

  deleteCity(city: City): Observable<any> {
    return this.http.delete(`${cityUrl}/${city.id}`);
  }
}

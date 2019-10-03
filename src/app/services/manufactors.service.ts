import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

const manufactorsUrl = 'http://165.22.83.21:3000/api/verications-protocols/manufacturers';

interface Manufacturer {
  manufacturer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  private manuSource$: BehaviorSubject<Manufacturer[]> = new BehaviorSubject<Manufacturer[]>([]);
  manufacturers$: Observable<Manufacturer[]> = this.manuSource$.asObservable();

  constructor(private http: HttpClient) {
    this.fetchManufacturers();
  }

  fetchManufacturers(): void {
    this.http.get<Manufacturer[]>(manufactorsUrl).subscribe(value => this.manuSource$.next(value));
  }

  getManufacturers(): Observable<Manufacturer[]> {
    return this.manufacturers$;
  }
}

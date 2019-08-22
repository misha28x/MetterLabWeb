import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const startStateUrl = 'http://165.22.83.21:3000/api/verications-protocols/test/init/';
const endStateUrl = 'http://165.22.83.21:3000/api/verications-protocols/test/final/';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  updateEndState(id: number, value: string): void {
    this.http.put(endStateUrl + id, { finalValue: value }).subscribe(res => { });
  }

  updateStartState(id: number, value: string): void {
    this.http.put(startStateUrl + id, { initValue: value }).subscribe(res => { });
  }
}

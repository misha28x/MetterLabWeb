import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const startStateUrl = 'http://localhost:3000/api/verications-protocols/test/init/';
const endStateUrl = 'http://localhost:3000/api/verications-protocols/test/final/';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  updateEndState(id: number, value: number): void {
    this.http.put(endStateUrl + id, value).subscribe();
  }

  updateStartState(id: number, value: number): void {
    this.http.put(startStateUrl + id, value).subscribe();
  }
}

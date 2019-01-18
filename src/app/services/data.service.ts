import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }

	getData(url: string): any {
		return this.http.get(url);
	}

  sendData(url: string, data: any): any {
    return this.http.post(url, data);
  }

	handleError(error: any): Observable<never> {
		return observableThrowError(error.error || 'Server Error');
	}
}

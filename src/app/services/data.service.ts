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

	getFile(url: string): any {
    window.open(url);
	}

  sendData(url: string, data?: any): any {
    let sendData = {};
    
    if (data) {
      sendData = data;
    }
    
    return this.http.post(url, sendData);
  }

	handleError(error: any): Observable<never> {
		return observableThrowError(error.error || 'Server Error');
	}
}

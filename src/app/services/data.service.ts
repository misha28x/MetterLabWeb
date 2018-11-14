import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }

	getData(url: string): any {
		const URL: string = url;

		return this.http.get(URL);
	}

	handleError(error: any): Observable<never> {
		return observableThrowError(error.error || 'Server Error');
	}
}

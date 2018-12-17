import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { Protocol, Test } from '../interfaces/protocol';

const url = 'http://localhost:3000/api/upload/zip';

@Injectable({
	providedIn: 'root'
})
export class UploadService {

	constructor(private http: HttpClient) { }

	public upload(file: File): void {
    const fileData: FormData = new FormData();

    fileData.append('file', file);
    this.http.post(url, fileData)
      .subscribe(
        () => {
          console.log('success');
        }
      );
	}
}

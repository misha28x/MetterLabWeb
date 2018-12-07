import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const url = 'http://localhost:3000/api/upload';

@Injectable({
	providedIn: 'root'
})
export class UploadService {

	constructor(private http: HttpClient) { }

	public upload(files: Set<File>): void {
		let counter = 0;

		files.forEach( file => {
			let reader = new FileReader();
			let bbiFile = reader.readAsArrayBuffer(reader);
			console.log(bbiFile);
		});
	}
}

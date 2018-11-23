import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const url = 'https://localhost:3000/api/posts';

@Injectable({
	providedIn: 'root'
})
export class UploadService {

	constructor(private http: HttpClient) { }

	addPost(): void {
		const post = { title: 'Title', message: 'Post' };

		this.http.post(url, post);
	}

	public upload(files: Set<File>): void {
		
		files.forEach(file => {
			const fileData: FormData = new FormData();
			fileData.append('file', file, file.name);
			this.http.post(url, fileData)
			.subscribe(
				res => {
					console.log('success');
				}
			);
		});
	}
}

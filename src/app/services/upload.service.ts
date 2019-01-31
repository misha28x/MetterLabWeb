import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import { Protocol, Test } from '../interfaces/protocol';

const url = 'http://localhost:3000/api/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): void {
    const fileData: FormData = new FormData();

    files.forEach(file => {
      fileData.append('file', file);
      this.http.post(url, fileData).subscribe();
    });
  }
}

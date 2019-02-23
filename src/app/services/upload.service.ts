import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public uploadScan(file: File, id: string): Observable<any> {
    const scanUrl = 'http://localhost:3000/api/verifications-archive/scan/' + id;
    const fileData: FormData = new FormData();
    fileData.append('scan', file, file.name);

    return this.http.post(scanUrl, fileData);
  }
  public getScan(id: string): void {
    const scanUrl = 'http://localhost:3000/api/verifications-archive/scan/' + id;
  
    window.open(scanUrl);
  }
}

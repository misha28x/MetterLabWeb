import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { User } from '../interfaces/user';

// import { Protocol, Test } from '../interfaces/protocol';

const url = 'http://134.209.243.90:3000/api/upload/';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  user: User;
  
  constructor(
    private http: HttpClient,
    private store: Store<User>
    ) {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
    });
    }

  public upload(files: Set<File>): void {
    const fileData: FormData = new FormData();

    files.forEach(file => {
      fileData.append('file', file);
      this.http.post(url + this.user.serviceProvider, fileData).subscribe();
    });
  }

  public uploadScan(file: File, id: string): Observable<any> {
    const scanUrl = 'http://134.209.243.90:3000/api/verifications-archive/scan/' + id;
    const fileData: FormData = new FormData();
    fileData.append('scan', file, file.name);

    return this.http.post(scanUrl, fileData);
  }
  public getScan(id: string): void {
    const scanUrl = 'http://134.209.243.90:3000/api/verifications-archive/scan/' + id;
  
    window.open(scanUrl);
  }
}

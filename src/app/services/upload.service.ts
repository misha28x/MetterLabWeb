import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { IUser } from '../interfaces/user';

const scanUrl = 'http://165.22.83.21:3000/api/verifications-archive/scan/';
const url = 'http://165.22.83.21:3000/api/upload/';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  user: IUser;

  constructor(private http: HttpClient, private store: Store<IUser>) {
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
    const fileData: FormData = new FormData();
    fileData.append('scan', file, file.name);

    return this.http.post(scanUrl + id, fileData);
  }

  public getScan(id: string): void {
    window.open(scanUrl + id);
  }
}

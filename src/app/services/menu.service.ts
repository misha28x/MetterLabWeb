import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { IMenuItem } from '../interfaces/menu';

const menuUrl = 'http://localhost:3000/api/menu/';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource$ = new BehaviorSubject<IMenuItem[]>([]);
  private permission;
  
  constructor(private http: HttpClient, private store: Store<string>) { 
    this.store.select('permission').subscribe(permission => {
      this.setMenu(permission);
    });
  }

  public setMenu(permission: string): void {
    this.http.get(menuUrl + permission).subscribe((res: {menu: IMenuItem[]}) => this.menuSource$.next(res.menu));
  }

  public getMenu(): Observable<IMenuItem[]> {
     return this.menuSource$.asObservable();
  }
}

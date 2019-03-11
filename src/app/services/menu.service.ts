import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';

import { IMenuItem } from '../interfaces/menu';

const menuUrl = 'http://localhost:3000/api/menu/';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource$ = new BehaviorSubject<IMenuItem[]>([]);
  private isVisiting$ = new BehaviorSubject<{ state: boolean, name?: string }>({ state: false });
  private menuUpdate = this.socket.fromEvent<any>('update');
  private permission: any;

  constructor(
    private http: HttpClient,
    private store: Store<string>,
    private socket: Socket
    ) { 
    this.store.select('permission').subscribe(user => {
      this.permission = user.permission;
      this.setMenu(this.permission);
    });

    this.menuUpdate.subscribe(() => {
      this.setMenu(this.permission);
    });
  }

  public setMenu(permission: string): void {
    this.http.get(menuUrl + permission).subscribe((res: {menu: IMenuItem[]}) => this.menuSource$.next(res.menu));
  }

  public getMenu(): Observable<IMenuItem[]> {
     return this.menuSource$.asObservable();
  }

  public getVisitState(): Observable<any> {
    return this.isVisiting$.asObservable();
  }

  public setVisitState(visit: any): void {
    this.isVisiting$.next(visit);

    if (!visit.state) {
      this.setMenu(this.permission);
    }
  }
}

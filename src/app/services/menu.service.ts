import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';

import { IUser } from '../interfaces/user';
import { IMenuItem } from '../interfaces/menu';
import { login } from '../store/actions/permission.action';
import { take } from 'rxjs/operators';

const menuUrl = 'http://165.22.83.21:3000/api/menu/';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource$ = new BehaviorSubject<IMenuItem[]>([]);
  private isVisiting$ = new BehaviorSubject<{ state: boolean; name?: string }>({
    state: false
  });
  private menuUpdate = this.socket.fromEvent<any>('update');
  private permission: any;
  private user: IUser;
  private home: any = null;

  constructor(
    private http: HttpClient,
    private store: Store<string>,
    private socket: Socket
  ) {
    this.store.select('permission').subscribe(user => {
      this.user = user;

      if (+user.permission > 0) {
        this.setMenu(this.user.permission, this.user.serviceProvider);
      }

      if (!this.home) {
        this.home = user;
      }
    });

    this.menuUpdate.subscribe(() => {
      this.setMenu(this.user.permission, this.user.serviceProvider);
    });
  }

  public setMenu(permission: any, serviceProvider: string): void {
    this.http
      .get(menuUrl + permission + '/' + serviceProvider)
      .subscribe((res: { menu: IMenuItem[] }) => this.menuSource$.next(res.menu));
  }

  public getMenu(): Observable<IMenuItem[]> {
    return this.menuSource$.asObservable();
  }

  public getVisitState(): Observable<any> {
    return this.isVisiting$.asObservable();
  }

  public cancelVisit(): void {
    this.isVisiting$.next({ state: false });

    this.store.dispatch(login(this.home));
  }

  public setVisitState(user: IUser): void {
    this.store.dispatch(login(user));

    this.setMenu(user.permission, user.serviceProvider);

    this.isVisiting$.next({ state: true, name: user.username });
  }
}

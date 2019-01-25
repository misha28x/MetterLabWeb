import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { IMenuItem } from '../interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuSource$ = new Subject<IMenuItem[]>();
  private menuAdded$ = this.menuSource$.asObservable();

  constructor() { }

  public setMenu(menu: IMenuItem[]): void {
    this.menuSource$.next(menu);
  }

  public getMenu(): Observable<IMenuItem[]> {
    return this.menuAdded$;
  }
}

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoOrientationService {
  private angle: number;

  private angleSource$: Subject<number> = new Subject<number>();
  private angleProvider: Observable<number> = this.angleSource$.asObservable();

  constructor() { 
    this.angle = 0;
  }

  public rotate(angle: number): void {
    this.angle += angle;
    this.angleSource$.next(this.angle);
  }

  public setAngle(angle: number): void {
    this.angle = angle;
  }

  public getAngle(): number {
    return this.angle;
  }

  public getAngleObservable(): Observable<number> {
    return this.angleProvider;
  }
}

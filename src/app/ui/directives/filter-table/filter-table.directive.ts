import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck } from 'rxjs/operators';

@Directive({
  selector: '[appFilterTable]'
})
export class FilterTableDirective implements OnDestroy {
  private sub: Subscription;

  @Input() appFilterTable: any = {};

  @Output() filterChanged: EventEmitter<string> = new EventEmitter();

  @Input()
  set config(value: any) {
    this.appFilterTable = value;
  }

  get config(): any {
    return this.appFilterTable;
  }

  constructor(private elRef: ElementRef) {
    this.sub = fromEvent(elRef.nativeElement, 'keydown')
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        pluck('target'),
        pluck('value'),
        map((val: string) => val.toLowerCase())
      )
      .subscribe(val => {
        this.filterChanged.emit(val);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

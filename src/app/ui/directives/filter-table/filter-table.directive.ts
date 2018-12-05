import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

// function setProperty(renderer: Renderer, elementRef: ElementRef, propName: string, propValue: any): void {
//   renderer.setElementProperty(elementRef, propName, propValue);
// }

@Directive({
  selector: '[appFilterTable]'
})
export class FilterTableDirective {

	@Input() public appFilterTable: any = {};

  @Output() public filterChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  public get config(): any {
    return this.appFilterTable;
	}
	
	public constructor() { }

  public set config(value: any) {
    this.appFilterTable = value;
  }

  @HostListener('input', ['$event.target.value'])
  public onChangeFilter(event: any): void {
		this.appFilterTable.filterString = event;
    this.filterChanged.emit(this.appFilterTable.filterString);
	}
}

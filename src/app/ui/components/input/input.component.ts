import { Component, OnInit, Input, forwardRef, HostBinding, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { IInputProperties } from '../../interfaces/input';
import { state } from '../../interfaces/general';

const PROPERTIES_NAMES: string[] = ['prefix', 'suffix', 'prefixIcon', 'suffixIcon', 'placeholder'];

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @HostBinding('class.tc-input') true;
  @HostBinding('class.input-sm') get smSize(): boolean {
    return this.size === 'sm';
  }
	@HostBinding('class.input-lg') get lgSize(): boolean {
    return this.size === 'lg';
  }
	@HostBinding('class.input-focus') get focus(): boolean {
    return this.inputFocus;
  }
  @HostBinding('class.input-disabled') @Input() disabled: boolean;
  @HostBinding('class.input-readonly') @Input() readonly: boolean;
  @Input() type: string;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() charLimiting: number;
  @Input() prefix: string | string[];
  @Input() suffix: string | string[];
  @Input() prefixIcon: string | string[];
  @Input() suffixIcon: string | string[];
  @Input() size: string;
  @Input() required: boolean;
  @Input() autoSize: boolean;
  @Input() innerValue: string;
  @Input() bgColor: string | string[];
  @Input() borderColor: string | string[];
  @Input() color: string | string[];
  inputFocus: boolean;
  charLength: number;
  properties: IInputProperties;
  currentBgColor: string;
  currentBorderColor: string;
  currentColor: string;
  states: any;
  
  constructor(private element: ElementRef) {
    this.type = 'text';
    this.name = '';
    this.size = 'md';
    this.inputFocus = false;
    this.readonly = false;
    this.disabled = false;
    this.required = false;
    this.autoSize = false;
    this.innerValue = '';
    this.properties = {
      prefixValue: '',
      prefixColor: '',
      suffixValue: '',
      suffixColor: '',
      prefixIconValue: '',
      prefixIconColor: '',
      suffixIconValue: '',
      suffixIconColor: ''
		};
		
    this.states = state;
	}
	
	onChange: any = () => { };
	onTouched: any = () => { };

  ngOnInit(): void {
    this.charLength = this.charLimiting;

    if (this.autoSize) {
      setTimeout(() => {
        this.resizable(this.element.nativeElement.querySelector('.input-control'));
      }, 0);
    }

    PROPERTIES_NAMES.forEach(property => {
      const PROPERTY = this[property];

      this.properties[`${property}Value`] = PROPERTY instanceof Array ? PROPERTY[0] : PROPERTY;
      this.properties[`${property}Color`] = PROPERTY instanceof Array ? PROPERTY[1] : null;
    });

    this.setStyles(!this.disabled ? this.states.default : this.states.disabled);
  }

	get value(): string {
    return this.innerValue;
  }

	set value(v: string) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }

    if (this.charLimiting > 0) {
      this.charLength = this.charLimiting - this.innerValue.length;
    }
  }

	registerOnChange(fn: any): void {
    this.onChange = fn;
  }

	registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

	writeValue(value: string): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

	onFocus(disabled: boolean): void {
    if (!this.inputFocus && !disabled) {
      this.element.nativeElement.querySelector('.input-control').focus();
      this.inputFocus = true;

      this.setStyles(this.states.focus);
    }
  }

	onBlur(disabled: boolean): void {
    this.inputFocus = false;

    if (!disabled) { 
			this.setStyles(this.states.default);
		}
  }

	@HostListener('mouseenter') onMouseEnter(): void {
		if (!this.inputFocus && !this.disabled && !this.readonly) { 
			this.setStyles(this.states.hover); 
		} 
  }
	@HostListener('mouseleave') onMouseLeave(): void {
		if (!this.inputFocus && !this.disabled && !this.readonly) {
			this.setStyles(this.states.default);
		}
  }

	resizable(el: any, factor?: number): void {
    const INT: number = Number(factor) || 7.7;

		function resize(): void {
      el.parentElement.style.maxWidth = ((el.value.length * INT) + 4) + 'px';
    }

    const e = 'keyup, keypress, focus, blur, change'.split(',');

    for (let i = 0; i < e.length; i++) {
      el.addEventListener(e[i], resize, false);
    }

    resize();
  }

  setStyles(
    st: state,
    bg: string | string[] = this.bgColor,
    border: string | string[] = this.borderColor,
    color: string | string[] = this.color
	): void {
    let styleIndex: number = 0;

    switch (st) {
      case this.states.hover:
        styleIndex = 1;
        break;
      case this.states.focus:
        styleIndex = 2;
        break;
      case this.states.disabled:
        styleIndex = 3;
        break;
      default:
        styleIndex = 0;
    }

    this.currentBgColor = bg instanceof Array ? bg[styleIndex] : bg;
    this.currentBorderColor = border instanceof Array ? border[styleIndex] : border;
    this.currentColor = color instanceof Array ? color[styleIndex] : color;
  }

  getStyles(): any {
    return {
      'background-color': this.currentBgColor,
      'border-color': this.currentBorderColor,
      'color': this.currentColor
    };
  }
}

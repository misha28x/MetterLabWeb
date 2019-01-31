/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MetrologyProtocolsComponent } from './metrology-protocols.component';

describe('MetrologyProtocolsComponent', () => {
  let component: MetrologyProtocolsComponent;
  let fixture: ComponentFixture<MetrologyProtocolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetrologyProtocolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetrologyProtocolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartStateDialogComponent } from './start-state-dialog.component';

describe('StartStateDialogComponent', () => {
  let component: StartStateDialogComponent;
  let fixture: ComponentFixture<StartStateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartStateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndStateDialogComponent } from './end-state-dialog.component';

describe('EndStateDialogComponent', () => {
  let component: EndStateDialogComponent;
  let fixture: ComponentFixture<EndStateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndStateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndStateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

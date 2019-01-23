import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterDialogDataComponent } from './counter-dialog-data.component';

describe('CounterDialogDataComponent', () => {
  let component: CounterDialogDataComponent;
  let fixture: ComponentFixture<CounterDialogDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterDialogDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterDialogDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

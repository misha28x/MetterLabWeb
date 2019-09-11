import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetrologyReportsComponent } from './metrology-reports.component';

describe('MetrologyReportsComponent', () => {
  let component: MetrologyReportsComponent;
  let fixture: ComponentFixture<MetrologyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetrologyReportsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetrologyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

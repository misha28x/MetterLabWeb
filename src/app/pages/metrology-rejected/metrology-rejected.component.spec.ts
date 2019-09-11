import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetrologyRejectedComponent } from './metrology-rejected.component';

describe('MetrologyRejectedComponent', () => {
  let component: MetrologyRejectedComponent;
  let fixture: ComponentFixture<MetrologyRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetrologyRejectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetrologyRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

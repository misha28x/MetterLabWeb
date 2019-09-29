import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersRejectedComponent } from './providers-rejected.component';

describe('ProvidersRejectedComponent', () => {
  let component: ProvidersRejectedComponent;
  let fixture: ComponentFixture<ProvidersRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidersRejectedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVerificationComponent } from './new-verification.component';

describe('NewVerificationComponent', () => {
  let component: NewVerificationComponent;
  let fixture: ComponentFixture<NewVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

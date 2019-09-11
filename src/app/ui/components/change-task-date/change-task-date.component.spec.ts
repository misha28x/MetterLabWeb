import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTaskDateComponent } from './change-task-date.component';

describe('ChangeTaskDateComponent', () => {
  let component: ChangeTaskDateComponent;
  let fixture: ComponentFixture<ChangeTaskDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeTaskDateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTaskDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

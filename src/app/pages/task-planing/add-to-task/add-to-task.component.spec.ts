import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToTaskComponent } from './add-to-task.component';

describe('AddToTaskComponent', () => {
  let component: AddToTaskComponent;
  let fixture: ComponentFixture<AddToTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddToTaskComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSendingComponent } from './task-sending.component';

describe('TaskSendingComponent', () => {
  let component: TaskSendingComponent;
  let fixture: ComponentFixture<TaskSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListEditComponent } from './task-list-edit.component';

describe('TaskListEditComponent', () => {
  let component: TaskListEditComponent;
  let fixture: ComponentFixture<TaskListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

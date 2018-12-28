import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListEditDialogComponent } from './task-list-edit-dialog.component';

describe('TaskListEditDialogComponent', () => {
  let component: TaskListEditDialogComponent;
  let fixture: ComponentFixture<TaskListEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskListEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

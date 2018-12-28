import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TaskListEditDialogComponent } from './task-list-edit-dialog/task-list-edit-dialog.component';

@Component({
  selector: 'app-task-list-edit',
  templateUrl: './task-list-edit.component.html',
  styleUrls: ['./task-list-edit.component.scss']
})
export class TaskListEditComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }
}

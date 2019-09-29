import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SourceService } from '../../../services/source.service';
import { Task } from '../../../interfaces/taskData';

@Component({
  selector: 'app-add-to-task',
  templateUrl: './add-to-task.component.html',
  styleUrls: ['./add-to-task.component.scss']
})
export class AddToTaskComponent implements OnInit {
  taskList: Observable<Task>;

  constructor(private sourceService: SourceService) {}

  ngOnInit(): void {
    this.sourceService.fetchStationTasks();
    this.taskList = this.sourceService.getStationTasks();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DataService } from './../../services/data.service';
import { TaskSendingComponent } from './task-sending/task-sending.component';
import { Task } from 'src/app/interfaces/taskData';

@Component({
  selector: 'app-task-planing',
  templateUrl: './task-planing.component.html',
  styleUrls: ['./task-planing.component.scss']
})
export class PageTaskPlaningComponent implements OnInit {
	data: any;
	config: any;
	columns: Array<any>;
	tableData: any;

  selectedData: any[];

  constructor(private dataSv: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
		this.config = {
			sorting: { columns: this.columns },
			filtering: {
				filterString: ''
			}
		};

		this.tableData = this.dataSv.getData('http://localhost:3000/api/task-verification');
  }

  sendData(): void {
    const dialogRef = this.dialog.open(TaskSendingComponent);

    dialogRef.afterClosed().subscribe(
      (data: Task) => {
        const taskData = {
          taskDate: data.taskDate,
          type: data.serviceType,
          number: data.stationNumber
        };

        const url = 'http://localhost:3000/api/task-planing/station-task';

        this.dataSv.sendData(url, taskData);
      }
    );
  }
}

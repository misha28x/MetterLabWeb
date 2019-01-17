import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DataService } from '../../services/data.service';
import { TaskSendingComponent } from './task-sending/task-sending.component';
import { Task } from '../../interfaces/taskData';

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

    this.selectedData = [];

    this.tableData = this.dataSv.getData('http://localhost:3000/api/task-planing');
  }

  sendData(): void {
    let stations = [];

    const url = 'http://localhost:3000/api/task-planing/stations';

    this.dataSv.getData(url)
    .subscribe(
      data => {
        stations = data.map(
          station => {
            return station.stationNumber;
          }
        );

        this.request(stations);
      }
    );
  }

  request(stations: string[]): void {
    const dialogRef = this.dialog.open(TaskSendingComponent, {
      data: stations
    });

    dialogRef.afterClosed().subscribe(
      (data: Task) => {
        const taskData = {
          taskDate: data.taskDate,
          type: data.serviceType,
          number: data.stationNumber,
          verifications: this.selectedData
        };

        const url = 'http://localhost:3000/api/task-planing/station-task';

        this.dataSv.sendData(url, taskData);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data.service';

const url = 'http://localhost:3000/api/stations-tasks';

@Component({
  selector: 'app-stations-tasks',
  templateUrl: './stations-tasks.component.html',
  styleUrls: ['./stations-tasks.component.scss']
})
export class PageStationsTasksComponent implements OnInit {

	stationsTasks: Observable<any[]>;

	constructor(private dataSv: DataService) { }

  ngOnInit(): void {
		this.stationsTasks = this.dataSv.getData(url);
  }
}

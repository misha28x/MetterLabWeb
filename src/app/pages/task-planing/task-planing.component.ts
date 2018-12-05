import { Component, OnInit } from '@angular/core';

import { DataService } from './../../services/data.service';

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

  constructor(private dataSv: DataService) { }

  ngOnInit(): void {
		this.config = {
			sorting: { columns: this.columns },
			filtering: {
				filterString: ''
			}
		};

		this.tableData = this.dataSv.getData('http://localhost:3000/api/task-verification');
  }
}

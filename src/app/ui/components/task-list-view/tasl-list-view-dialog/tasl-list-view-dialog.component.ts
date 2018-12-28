import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-tasl-list-view-dialog',
  templateUrl: './tasl-list-view-dialog.component.html',
  styleUrls: ['./tasl-list-view-dialog.component.scss']
})
export class TaslListViewDialogComponent implements OnInit {

	taskList: Observable<any[]>;
	private url: string;

	constructor(private dataSv: DataService) { }

  ngOnInit() {
		this.url = 'http://localhost:3000/api/station-tasks';

		this.taskList = this.dataSv.getData(this.url);
  }
}

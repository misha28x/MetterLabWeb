import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

import { TCTableComponent } from '../';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
	@ContentChild('tableBodyTemplate') bodyTemplate: TemplateRef<any>;
	@ContentChild('headerBodyTemplate') headerTemplate: TemplateRef<any>;

	@Input() columnTitle: string;
	@Input() columnName: string;
	@Input() enableFiltering: boolean;
	@Input() enableSorting: boolean;

	config: any;
		
  constructor(private table: TCTableComponent) {
		this.enableFiltering = false;
		this.enableSorting = false;

		this.config = {
			title: '',
			name: '',
			sort: '',
			enableSorting: this.enableSorting,
			filter: this.enableFiltering,
			filtering: {
				filterString: '',
				columnName: ''
			}
		};
	}

	public setConfig(): void {
		this.config.name = this.columnName;
		this.config.title = this.columnTitle;
		this.config.filtering.columnName = this.columnName;
		this.config.enableSorting = this.enableSorting;
	}

  ngOnInit(): void {
		this.table.addColumn(this);
		this.setConfig();
  }
}

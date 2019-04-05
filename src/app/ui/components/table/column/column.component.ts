import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

import { TableComponent } from '../';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html'
})
export class ColumnComponent implements OnInit {
	@ContentChild('tableBodyTemplate') bodyTemplate: TemplateRef<any>;
	@ContentChild('headerBodyTemplate') headerTemplate: TemplateRef<any>;

	@Input() columnTitle: string;
	@Input() columnName: string;
	@Input() enableFiltering: boolean;
	@Input() enableSorting: boolean;
  @Input() width: number;
  @Input() date: boolean;

	public config: any;
		
  constructor(private table: TableComponent) {
		this.enableFiltering = false;
		this.enableSorting = false;

		this.config = {
			title: '',
			name: '',
      sort: '',
      date: this.date,
			enableSorting: this.enableSorting,
			filter: this.enableFiltering,
			filtering: {
				filterString: null,
				columnName: ''
			}
		};

    this.width = 160;
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

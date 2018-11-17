import { Component, Input, HostBinding, OnInit } from '@angular/core';

import { ColumnComponent } from './column/column.component';
import { ITableConfig } from '../../interfaces/tableConfig';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements  OnInit  {
	@HostBinding('class.tc-table') true;

	@Input() borderColor: string;
	@Input() borderStyle: string;
	@Input() contentBgColor: string;
	@Input() contentColor: string;
	@Input() headerBgColor: string;
	@Input() headerColor: string;
	@Input() headerAlign: string;
	@Input() rowAlign: string;

	@Input() pagination: boolean;
	@Input() bordered: boolean;
	@Input() striped: boolean;
	@Input() hovered: boolean;
	@Input() search: boolean;

	@Input() config: ITableConfig;
	@Input() rows: Array<any>;
	@Input() itemsPerPage: number;

	columnList: ColumnComponent[];

	private data: Array<any>;
	private filtering: any;
	private _columns: Array<any>;
	private pagesCount: number;
	private page: number;

	constructor() {
		this.borderStyle = 'solid';
		this.headerAlign = 'left';
		this.rowAlign = 'left';
		this.headerColor = '#000';
		this.headerBgColor = 'rgba(#000,0.15)';

		this.columnList = [];
		this._columns = [];

		this.config = {
			sorting: true,
			filtering: {
				filtering: true,
				filterString: ''
			}
		};

		this.itemsPerPage = 10;
		this.page = 1;
	}

	ngOnInit(): void {
		this.getColumns();
		this.data = this.rows;
		this.pagesCount = Math.ceil(this.rows.length / this.itemsPerPage);
		this.onChangeTable(this.data, null);
	}

	addColumn(column: ColumnComponent): void {
    this.columnList.push(column);
  }

	getTableClasses(): any {
		return {
			'stripped': this.striped,
			'hovered' : this.hovered,
			'bordered': this.bordered
		};
	}

	public getColumns(): void {
		this.columnList.forEach(col => {
			this._columns.push(col.config);
		});
	}

	public getConfigColumns(): any {
		const sortColumns: Array<any> = [];

		this._columns.forEach(column => {
			if (column.sort) {
				sortColumns.push(column);
			}
		});

		return { _columns: sortColumns };
	}

	public goToPage(pageNum: number): void {
		this.page = pageNum;
		this.onChangeTable(this.data, null);
	}

	public changePage(page: number, itemsPerPage: number, data: Array<any>): Array<any> {
		const start = (page - 1) * itemsPerPage;
		const end = itemsPerPage > -1 ? (start + itemsPerPage) : data.length;
		return data.slice(start, end);
	}

	public changeSort(data: any, config: any): any {
    if (!config.sorting) {
			return data;
		}

		const columns = [];
		this.columnList.forEach(col => {
			columns.push(col.config);
		});

    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
		}

		if (!columnName) {
      return data;
    }

    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
			} 
			
      return sort === 'asc' ? -1 : 1;
    });
	}

	public changeFilter(data: any, config: any): any {
		let filteredData: Array<any> = data;

    this.columnList.forEach((column: any) => {
			if (column.config.filtering) {
				filteredData = filteredData.filter((item: any) => {
					return item[column.config.name].toLowerCase().match(column.config.filtering.filterString.toLowerCase());
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].toLowerCase().match(config.filtering.filterString.toLowerCase()));
    }

    const tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columnList.forEach((column: any) => {
				if (item[column.config.name].toString().toLowerCase().match(config.filtering.filterString.toLowerCase())) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

	public onChangeTable(config: any, column: ColumnComponent): any {
    if (config.filtering) {
			Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
			Object.assign(this.config.sorting, config.sorting);
		}
		let filteredData;
		if (column) {
			filteredData = this.changeFilter(this.data, column.config);
		} else {
			filteredData = this.changeFilter(this.data, config);
		}
		const sortedData = this.changeSort(filteredData, this.config);
		this.rows = this.pagination ? this.changePage(this.page, this.itemsPerPage, sortedData) : sortedData;
  }

	public filterClick(column: any, event: Event): void {
		event.stopPropagation();
		if (column.filter) {
			column.filter = false;
		} else {
			this.columnList.forEach(col => {
				col.config.filter = false;
			});
			column.filter = true;
		}
	}

	trackByFn(index: number, item: any): any {
		return index;
	}
}

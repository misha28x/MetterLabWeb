import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';

import { ColumnComponent } from './column/column.component';
import { ITableConfig } from '../../interfaces/tableConfig';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements  OnInit  {
	@HostBinding('class.tc-table') true;

	@Input() pagination: boolean;
	@Input() bordered: boolean;
	@Input() striped: boolean;
	@Input() hovered: boolean;
	@Input() search: boolean;

	@Input() config: ITableConfig;
	@Input() tableData: Observable<any>;
	@Input() itemsPerPage: number;

	columnList: ColumnComponent[];

	pageEvent: PageEvent;
	filtering: any;
	_columns: Array<any>;
	page: number;
	pageSizeOptions: number[];
	dataLenght: number;
	private data: Array<any>;
	private rows: Array<any>;

	constructor() {
		this.columnList = [];
		this._columns = [];

		this.config = {
			sorting: true,
			filtering: {
				filtering: true,
				filterString: ''
			}
		};

		this.pageSizeOptions = [10, 50, 100, 200];
		this.itemsPerPage = this.pageSizeOptions[0];
		this.page = 0;
	}

	ngOnInit(): void {
		this.getColumns();
		this.subscribeToData();
	}

	subscribeToData(): void {
		const observer = {
			next: x => this.setData(x),
			error: err => console.log(err)
		};

		this.tableData.subscribe(observer);
	}

	setData(data: any[]): void {
		if (data && data.length > 0) {
			this.data = [].concat(data);
			this.rows = [].concat(data);
			this.initData();
		}
	}

	initData(): void {
		this.getColumns();
		this.onChangeTable();
	}

	addColumn(column: ColumnComponent): void {
    this.columnList.push(column);
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

	public onChangePage(event: PageEvent): void {
		this.page = event.pageIndex;
		this.itemsPerPage = event.pageSize;
		this.onChangeTable();
	}

	public changePage(data: any[]): any[] {
		let start = (this.page) * this.itemsPerPage;
		
		if (this.page > 0) {
			--start;
		}

		if (data.length < (start + this.itemsPerPage)) {
			return data.slice(start);
		}

		const end = start + this.itemsPerPage;
		return data.slice(start, end);
	}

	public changeSort(data: any, config: any): any {
		if (!config.sorting) {
			return data;
		}

		const columns = [];
		this.columnList.forEach(col => {
			columns.push(col.config);
		})
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
			} else if (previous[columnName] < current[columnName]) {
				return sort === 'asc' ? -1 : 1;
			}
			return 0;
		});
	}

	public changeFilter(data: any, filterString: string, column?: ColumnComponent): any {
		let filteredData: Array<any> = data;

		if (!filterString || filterString.length === 0) {
			return filteredData;
		}
		
		if (column) {
			filteredData = filteredData.filter((item: any) => {
				return item[column.config.name].toString().toLowerCase().match(filterString.toLowerCase());
			});
		}

    const tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columnList.forEach((column: any) => {
				if (item[column.config.name].toString().toLowerCase().match(filterString.toLowerCase())) {
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

	public onChangeTable(column?: ColumnComponent): void {
		if (column) {
				Object.assign(this.config, column.config);
		}
			
		const filteredData = this.changeFilter(this.data, this.config.filtering.filterString);
		
		const sortedData = this.changeSort(filteredData, this.config);
		
		this.dataLenght = sortedData.length;

		console.log({ data: this.data, rows: this.rows });

		if (this.pagination) {
			this.rows = this.changePage(sortedData);
		} else {
			this.rows = sortedData;
		}
  }

	trackByFn(index: number, item: any): any {
		return index;
	}

	getTableClasses(): any {
		return {
			'stripped': this.striped,
			'hovered': this.hovered,
			'bordered': this.bordered
		};
	}
}

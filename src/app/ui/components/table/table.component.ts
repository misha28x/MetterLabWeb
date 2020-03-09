import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material';

import { ColumnComponent } from './column/column.component';
import { TableService } from './table.service';

import { ITableConfig } from '../../interfaces/tableConfig';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges {
  @HostBinding('class.tc-table') true;

  @Input() pagination: boolean;
  @Input() checkboxes: boolean;
  @Input() bordered: boolean;
  @Input() hovered: boolean;
  @Input() striped: boolean;
  @Input() search: boolean;

  @Input() config: ITableConfig;
  @Input() itemsPerPage: number;
  @Input() tableData: any;

  @Input() desiredStatus: string;
  @Input() errorStatus: string;
  @Input() infoStatus: string;
  @Input() statusKey: string;

  @Input() actionHeaderTpl: TemplateRef<any>;

  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

  date: Date | Date[];

  columnList: ColumnComponent[];

  _columns: Array<any>;
  page: number;
  pageSizeOptions: number[];
  dataLenght: number;
  data: Array<any>;
  rows: Array<any>;

  selection = new SelectionModel<any>(true, []);

  constructor(private tableSv: TableService) {
    this.columnList = [];
    this._columns = [];
    this.statusKey = 'status';

    this.config = {
      sorting: true,
      filtering: {
        filtering: true,
        filterString: ''
      }
    };

    this.pageSizeOptions = [30, 50, 100, 200, 300, 500];
    this.itemsPerPage = this.pageSizeOptions[0];
    this.page = 0;
  }

  ngOnInit(): void {
    this.getColumns();
    this.setData(this.data);
  }

  ngOnChanges(): void {
    this.setData(this.tableData);
  }

  setData(data: any[]): void {
    if (data) {
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

  getColumns(): void {
    this.columnList.forEach(col => {
      this.tableSv.addColumn(col);
      this._columns.push(col.config);
    });
  }

  onChangePage(event: PageEvent): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.onChangeTable();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.rows.forEach(row => this.selection.select(row));
    this.rowSelected.emit(this.selection.selected);
  }

  changePage(data: any[]): any[] {
    let start = this.page * this.itemsPerPage;

    if (this.page > 0) {
      --start;
    }

    if (data.length < start + this.itemsPerPage) {
      return data.slice(start);
    }

    const end = start + this.itemsPerPage;
    return data.slice(start, end);
  }

  changeSort(data: any, config: any): any {
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

      if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  changeFilter(data: any, filterString: string, column?: ColumnComponent): any {
    let filteredData: Array<any> = data;

    const isDateColumn =
      column &&
      column.date &&
      Array.isArray(column.config.filtering) &&
      column.config.filtering.length;

    if (isDateColumn) {
      const firstDate = new Date(column.config.filtering[0]).toISOString();
      const secondDate = new Date(column.config.filtering[1]).toISOString();

      filteredData = filteredData.filter(row => {
        return (
          row[column.config.name] <= secondDate && row[column.config.name] >= firstDate
        );
      });

      return filteredData;
    }

    if (!filterString || filterString.length === 0) {
      return filteredData;
    }

    if (column) {
      filteredData = filteredData.filter((item: any) => {
        return item[column.config.name]
          .toString()
          .toLowerCase()
          .includes(filterString.toLowerCase());
      });

      return filteredData;
    }

    const tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columnList.forEach((_column: any) => {
        if (
          item[_column.config.name]
            .toString()
            .toLowerCase()
            .includes(filterString.toLowerCase())
        ) {
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

  filterChanged(c: ColumnComponent, value: string) {
    const field = c.config.name;

    this.tableSv.changeFilter(field, value);
    this.onChangeTable();
  }

  dateFilterChanged(c: ColumnComponent, value: Date[]) {
    const field = c.config.name;

    if (!value || value.length < 2) {
      this.tableSv.changeFilter(field);
      this.onChangeTable();
      return;
    }

    const toDateString = (date: Date) => date.toISOString().split('T')[0];

    const start = toDateString(value[0]);
    const end = toDateString(value[1]);

    this.tableSv.changeFilter(field, `${start}T${end}`);
    this.onChangeTable();
  }

  onChangeTable(column?: ColumnComponent, value?: string): void {
    if (column) {
      Object.assign(this.config.filtering, column.config.filtering);
      column.config.filtering = value || column.config.filtering;
    }

    const filteredData = this.tableSv.filterData(this.data);

    const sortedData = this.changeSort(filteredData, this.config);

    this.dataLenght = sortedData.length;

    if (this.pagination) {
      this.rows = this.changePage(sortedData);
    } else {
      this.rows = sortedData;
    }
  }

  onRowSelected(row: any): void {
    this.selection.toggle(row);
    this.rowSelected.emit(this.selection.selected);
  }

  clearSelected(): void {
    if (this.selection) {
      this.selection.clear();
      this.rowSelected.emit(this.selection.selected);
    }
  }

  trackByFn(index: number): any {
    return index;
  }

  getTableClasses(): any {
    return {
      stripped: this.striped,
      hovered: this.hovered,
      bordered: this.bordered
    };
  }

  getSuccessClass(row: any): boolean {
    if (this.desiredStatus) {
      return row[this.statusKey] === this.desiredStatus;
    }
  }

  getErrorClass(row: any): boolean {
    if (this.errorStatus) {
      return row[this.statusKey] === this.errorStatus;
    }
  }

  getInfoClass(row: any): boolean {
    if (this.infoStatus) {
      return row[this.statusKey] === this.infoStatus;
    }
  }
}

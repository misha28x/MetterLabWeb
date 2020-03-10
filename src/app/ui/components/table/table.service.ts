import { Injectable } from '@angular/core';

import { ColumnComponent } from './column/column.component';
export interface ColumnConfig {
  name: string;
  title: string;
  type: 'text' | 'date';
  value: string;
}

@Injectable()
export class TableService {
  private columns = new Map<string, ColumnConfig>();
  private filters = new Map<string, string>();

  constructor() {}

  changeFilter(field: string, value: string = '') {
    const result = !value || !value.length;

    if (result) {
      this.filters.delete(field);
    }

    this.filters.set(field, value);
  }

  addColumn(column: ColumnComponent) {
    this.columns.set(column.columnName, column.config);
  }

  filterData(data: any[]) {
    if (!this.filters || !this.filters.size) {
      return data;
    }

    const filterKeys = Array.from(this.filters.keys());

    return data.filter(item => this.checkRow(item, filterKeys));
  }

  private checkRow(row: any, keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const filter = this.filters.get(key);
      const col = row[key];

      if (!col) {
        return false;
      }

      if (!row[key]) {
        this.filters.delete(key);
        break;
      }

      const value = col.toString().toLowerCase();
      const { type = 'text' } = this.columns.get(key);

      const result = this.checkColumn(value, filter, type);

      if (!result) {
        return false;
      }
    }

    return true;
  }

  private checkColumn(val: string, filter: string, type: ColumnConfig['type']) {
    if (type === 'text') {
      return this.checkTextColumn(val, filter);
    }

    if (type === 'date') {
      return this.checkDateColumn(val, filter);
    }
  }

  private checkTextColumn(value: string, filter: string) {
    return value.includes(filter);
  }

  private checkDateColumn(val: string, filter: string) {
    const [start, end] = filter.split('T');
    return val >= start && end >= val;
  }
}

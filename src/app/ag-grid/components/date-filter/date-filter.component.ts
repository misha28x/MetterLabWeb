import { Component } from '@angular/core';
import {
  FilterChangedEvent,
  IFloatingFilter,
  IFloatingFilterParams,
  DateFilter
} from 'ag-grid-community';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements IFloatingFilter {
  filter = '';
  params: IFloatingFilterParams;
  currentValue;

  constructor() {}

  agInit(params: IFloatingFilterParams): void {
    this.params = params;
  }

  isFilterActive() {
    return this.filter !== '';
  }

  onSubmit(val: Date[]) {
    this.params.parentFilterInstance(instance => {
      (<DateFilter>instance).onFloatingFilterChanged('greater', val);
    });
  }

  onParentModelChanged(parentModel: any): void {
    if (!parentModel) {
      this.currentValue = 0;
    } else {
      // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
      // so just read off the value and use that
      console.log(parentModel);
      this.currentValue = parentModel.filter;
    }
  }
}

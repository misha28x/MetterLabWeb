import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

import { TableComponent } from '../';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html'
})
export class ColumnComponent implements OnInit {
  @ContentChild('tableBodyTemplate', { static: false }) bodyTemplate: TemplateRef<any>;
  @ContentChild('headerBodyTemplate', { static: false }) headerTemplate: TemplateRef<any>;

  @Input() columnTitle: string;
  @Input() columnName: string;
  @Input() enableFiltering: boolean;
  @Input() enableSorting: boolean;
  @Input() width: number;
  @Input() date: boolean;

  config: any;

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

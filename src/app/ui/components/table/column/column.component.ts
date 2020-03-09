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
  @Input() type: 'text' | 'date';
  @Input() date: boolean;

  config: any;

  constructor(private table: TableComponent) {
    this.enableFiltering = false;
    this.enableSorting = false;

    this.type = 'text';
    this.width = 160;
  }

  public setConfig(): void {
    this.config = {
      title: this.columnTitle,
      name: this.columnName,
      sort: '',
      date: this.date,
      // Fallback till refactored
      type: this.date || this.type === 'date' ? 'date' : 'text',
      enableSorting: this.enableSorting,
      filter: this.enableFiltering,
      filtering: {
        filterString: null,
        columnName: this.columnName
      }
    };
  }

  ngOnInit(): void {
    this.table.addColumn(this);
    this.setConfig();
  }
}

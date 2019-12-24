import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { NoteRendererComponent } from '../components/note/note-renderer/note-renderer.component';
import { ActionsComponent } from '../components/actions/actions.component';
import { DateFilterComponent } from '../components/date-filter/date-filter.component';
import { PhoneComponent } from '../components/phone/phone.component';
import { DateRendererComponent } from '../components/date-renderer/date-renderer.component';

@Component({
  selector: 'app-ver-table',
  templateUrl: './ver-table.component.html',
  styleUrls: ['./ver-table.component.scss']
})
export class VerTableComponent implements OnInit {
  columnList: Object[];
  _columnList: Object[];
  frameworkComponents: Object;
  defaultColDef: Object;

  gridApi: any;

  @Input() displayedColumns: string[];
  @Input() tableData: Observable<Object[]>;

  @Output() dataSelected = new EventEmitter();

  constructor() {
    this.displayedColumns = [];

    this.frameworkComponents = {
      noteRenderer: NoteRendererComponent,
      dateRangeFilter: DateFilterComponent,
      phoneRenderer: PhoneComponent,
      actions: ActionsComponent,
      dateRenderer: DateRendererComponent
    };

    this.defaultColDef = {
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        filterOptions: ['contains'],
        textFormatter: function(r: string): string {
          if (r === null) {
            return null;
          }

          r = r.toString();
          r = r.toLowerCase();
          return r;
        },
        debounceMs: 400,
        caseSensitive: false
      }
    };

    this._columnList = [
      {
        headerName: 'Дата',
        field: 'addingDate',
        width: 130,
        cellRenderer: 'dateRenderer',
        floatingFilter: 'date',
        floatingFilterComponent: 'dateRangeFilter',
        checkboxSelection: true,
        headerCheckboxSelection: true
      },
      { headerName: 'Номер лічильника', field: 'counterNumber', width: 150 },
      { headerName: 'Клієнт', field: 'client', width: 220, resizable: true },
      {
        headerName: 'Телефон',
        field: 'phoneNumber',
        width: 130,
        cellRenderer: 'phoneRenderer'
      },
      {
        headerName: 'Надавач послуг',
        field: 'serviceProvider',
        width: 190
      },
      {
        headerName: 'Тип послуги',
        field: 'serviceType',
        width: 130
      },
      { headerName: 'Місто', field: 'settlement', width: 120 },
      { headerName: 'Район', field: 'district', width: 140 },
      { headerName: 'Вулиця', field: 'street', minWidth: 180, resizable: true },
      { headerName: 'Буд', field: 'house', width: 50 },
      { headerName: 'Кв', field: 'apartment', width: 45 },
      { headerName: 'Статус', field: 'status' },
      { headerName: '№ установки', field: 'apartment', width: 120 },
      { headerName: '№ протоколу', field: 'apartment', width: 120 },
      { headerName: 'Дата підпису', field: 'apartment', width: 120 },
      { headerName: 'Придатний до', field: 'apartment', width: 120 },
      { headerName: 'Дата завдання', field: 'apartment', width: 80 },
      {
        headerName: 'Примітка',
        field: 'note',
        autoHeight: true,
        minWidth: 120,
        width: 300,
        cellStyle: {
          whiteSpace: 'normal'
        }
      },
      {
        headerName: 'Дії',
        field: '',
        cellRenderer: 'actions',
        width: 120,
        filter: null,
        sortable: false,
        cellStyle: {
          padding: '0 5px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }
      }
    ];
  }

  ngOnInit(): void {
    this.columnList = this.displayedColumns.length
      ? this._columnList.filter((col: any) =>
          this.displayedColumns.includes(col.headerName)
        )
      : this._columnList;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }
}

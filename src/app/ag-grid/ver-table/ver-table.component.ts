import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServiceTypeRendererComponent } from '../components/service-type/service-type-renderer/service-type-renderer.component';
import { ProviderRendererComponent } from '../components/providers/provider-renderer/provider-renderer.component';
import { ServiceEditorComponent } from '../components/service-type/service-editor/service-editor.component';
import { NoteRendererComponent } from '../components/note/note-renderer/note-renderer.component';
import { ProviderEditorComponent } from '../components/providers/provider-editor/provider-editor.component';
import { ActionsComponent } from '../components/actions/actions.component';
import { DateFilterComponent } from '../components/date-filter/date-filter.component';

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

  @Input() displayedColumns: string[];
  @Input() tableData: Observable<Object[]>;

  constructor() {
    this.displayedColumns = [];

    this.frameworkComponents = {
      serviceTypeRenderer: ServiceTypeRendererComponent,
      serviceEditor: ServiceEditorComponent,
      providerRenderer: ProviderRendererComponent,
      providerEditor: ProviderEditorComponent,
      noteRenderer: NoteRendererComponent,
      actions: ActionsComponent,
      dateRangeFilter: DateFilterComponent
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
        debounceMs: 200,
        caseSensitive: false
      }
    };

    this._columnList = [
      {
        headerName: 'Номер заявки',
        field: 'applicationNumber',
        width: 180,
        checkboxSelection: true,
        headerCheckboxSelection: true
      },
      {
        headerName: 'Дата додання',
        field: 'addingDate',
        width: 140,
        floatingFilterComponent: 'dateRangeFilter'
      },
      { headerName: 'Номер лічильника', field: 'counterNumber', width: 150 },
      { headerName: 'Клієнт', field: 'client' },
      {
        headerName: 'Надавач послуг',
        field: 'serviceProvider',
        cellRenderer: 'providerRenderer',
        width: 250,
        editable: true,
        cellEditor: 'providerEditor'
      },
      {
        headerName: 'Тип послуги',
        field: 'serviceType',
        cellRenderer: 'serviceTypeRenderer',
        editable: true,
        cellEditor: 'serviceEditor'
      },
      { headerName: 'Населений пункт', field: 'settle', width: 130 },
      { headerName: 'Район', field: 'district', width: 140 },
      { headerName: 'Вулиця', field: 'street' },
      { headerName: 'Буд', field: 'house', width: 75 },
      { headerName: 'Кв', field: 'apartment', width: 80 },
      { headerName: 'Статус', field: 'status' },
      { headerName: '№ установки', field: 'apartment', width: 120 },
      { headerName: '№ протоколу', field: 'apartment', width: 120 },
      { headerName: 'Дата підпису', field: 'apartment', width: 120 },
      { headerName: 'Придатний до', field: 'apartment', width: 120 },
      { headerName: 'Дата завдання', field: 'apartment', width: 80 },
      { headerName: 'Примітка', field: 'note', cellRenderer: 'noteRenderer' },
      {
        headerName: 'Дії',
        field: '',
        cellRenderer: 'actions',
        pinned: 'right',
        width: 40,
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
}

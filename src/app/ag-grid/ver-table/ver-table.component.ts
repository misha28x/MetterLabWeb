import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServiceTypeRendererComponent } from '../components/service-type-renderer/service-type-renderer.component';
import { ProviderRendererComponent } from '../components/provider-renderer/provider-renderer.component';
import { ServiceEditorComponent } from '../components/service-editor/service-editor.component';

@Component({
  selector: 'app-ver-table',
  templateUrl: './ver-table.component.html',
  styleUrls: ['./ver-table.component.scss']
})
export class VerTableComponent implements OnInit {
  @Input() columnList: string[];
  @Input() tableData: Observable<Object[]>;

  frameworkComponents = {
    serviceTypeRenderer: ServiceTypeRendererComponent,
    providerRenderer: ProviderRendererComponent,
    serviceEditor: ServiceEditorComponent
  };

  _columnList = [
    { headerName: 'Номер заявки', field: 'applicationNumber', width: 170 },
    { headerName: 'Дата додання', field: 'addingDate', width: 130 },
    { headerName: 'Номер лічильника', field: 'counterNumber', width: 150 },
    { headerName: 'Клієнт', field: 'client' },
    {
      headerName: 'Надавач послуг',
      field: 'serviceProvider',
      cellRenderer: 'providerRenderer',
      width: 250
    },
    {
      headerName: 'Тип послуги',
      field: 'serviceType',
      cellRenderer: 'serviceTypeRenderer',
      editable: true,
      cellEditor: 'serviceEditor'
    },
    { headerName: 'Населений пункт', field: 'settle', width: 130 },
    { headerName: 'Район', field: 'district' },
    { headerName: 'Вулиця', field: 'street' },
    { headerName: 'Буд', field: 'house', width: 75 },
    { headerName: 'Кв', field: 'apartment', width: 70 },
    { headerName: 'Статус', field: 'status' },
    { headerName: 'Кв', field: 'apartment', width: 70 },
    { headerName: '№ установки', field: 'apartment', width: 70 },
    { headerName: '№ протоколу', field: 'apartment', width: 70 },
    { headerName: 'Дата підпису', field: 'apartment', width: 120 },
    { headerName: 'Придатний до', field: 'apartment', width: 120 },
    { headerName: 'Дата завдання', field: 'apartment', width: 70 },
    { headerName: 'Примітка', field: 'note' }
  ];

  constructor() {}

  ngOnInit(): void {}
}

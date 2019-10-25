import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { VerTableComponent } from './ver-table/ver-table.component';
import { ServiceTypeRendererComponent } from './components/service-type/service-type-renderer/service-type-renderer.component';
import { ProviderRendererComponent } from './components/providers/provider-renderer/provider-renderer.component';
import { ServiceEditorComponent } from './components/service-type/service-editor/service-editor.component';
import { NoteRendererComponent } from './components/note/note-renderer/note-renderer.component';
import { ProviderEditorComponent } from './components/providers/provider-editor/provider-editor.component';
import { ActionsComponent } from './components/actions/actions.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { PhoneComponent } from './components/phone/phone.component';

@NgModule({
  declarations: [
    VerTableComponent,
    ServiceTypeRendererComponent,
    ProviderRendererComponent,
    ServiceEditorComponent,
    NoteRendererComponent,
    ProviderEditorComponent,
    ActionsComponent,
    DateFilterComponent,
    PhoneComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    NzDatePickerModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    AgGridModule.withComponents([
      ServiceTypeRendererComponent,
      ProviderRendererComponent,
      NoteRendererComponent,
      ProviderEditorComponent,
      ActionsComponent,
      DateFilterComponent,
      PhoneComponent
    ])
  ],
  exports: [VerTableComponent],
  entryComponents: [
    ServiceEditorComponent,
    NoteRendererComponent,
    ProviderEditorComponent,
    ActionsComponent
  ]
})
export class GridModule {}

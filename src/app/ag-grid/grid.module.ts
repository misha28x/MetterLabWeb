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
import { NoteRendererComponent } from './components/note/note-renderer/note-renderer.component';
import { ActionsComponent } from './components/actions/actions.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { PhoneComponent } from './components/phone/phone.component';
import { DateRendererComponent } from './components/date-renderer/date-renderer.component';

@NgModule({
  declarations: [
    VerTableComponent,
    NoteRendererComponent,
    ActionsComponent,
    DateFilterComponent,
    PhoneComponent,
    DateRendererComponent
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
      NoteRendererComponent,
      ActionsComponent,
      DateFilterComponent,
      PhoneComponent
    ])
  ],
  exports: [VerTableComponent],
  entryComponents: [NoteRendererComponent, ActionsComponent, DateRendererComponent]
})
export class GridModule {}

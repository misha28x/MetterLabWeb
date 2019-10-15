import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { VerTableComponent } from './ver-table/ver-table.component';
import { ServiceTypeRendererComponent } from './components/service-type-renderer/service-type-renderer.component';
import { ProviderRendererComponent } from './components/provider-renderer/provider-renderer.component';
import { ServiceEditorComponent } from './components/service-editor/service-editor.component';

@NgModule({
  declarations: [
    VerTableComponent,
    ServiceTypeRendererComponent,
    ProviderRendererComponent,
    ServiceEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    AgGridModule.withComponents([ServiceTypeRendererComponent, ProviderRendererComponent])
  ],
  exports: [VerTableComponent],
  entryComponents: [ServiceEditorComponent]
})
export class GridModule {}

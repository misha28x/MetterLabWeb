import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { MaterialModule } from './../material/material.module';

import { TableComponent } from './components/table';
import { ColumnComponent } from './components/table/column/column.component';
import { InputComponent } from './components/input';
import { FileUploadComponent } from './components/file-upload';

import { FilterTableDirective } from './directives/filter-table/filter-table.directive';
import { SortTableDirective } from './directives/sort-table/sort-table.directive';
import { UploadDialogComponent } from './components/file-upload/upload-dialog/upload-dialog.component';
import { NewVerificationComponent, NewVerificationDialogComponent } from './components/new-verification';
import { VerificationViewComponent } from './components/verification-view/verification-view.component';
import { DetailViewComponent, DetailViewDialogComponent } from './components/detail-view';
import { DuplicateViewComponent, DuplicatViewDialogComponent } from './components/duplicate-view';
import { BadgeComponent } from './components/badge';

import {
  ProtocolViewComponent,
  ProtocolDialogComponent,
  CounterDialogDataComponent,
  EndStateDialogComponent,
  StartStateDialogComponent
} from './components/protocol-view';

import { ScanUploadComponent } from './components/scan-upload';
import { SelectDialogComponent } from './components/select-dialog';
import { SealEditComponent } from './components/seal-edit';
import { UserInfoComponent } from './components/user-info';
import { AddEmployeeComponent } from './components/add-employee';
import { AddStationComponent } from './components/add-station';
import { DeleteDialogComponent } from './components/delete-dialog';
import { AddCityComponent } from './components/add-city/add-city.component';
import { AddContractorComponent } from './components/add-contractor/add-contractor.component';

@NgModule({
	imports: [
    MaterialModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
	exports: [
		SortTableDirective,
		FilterTableDirective,
		TableComponent,
		InputComponent,
		ColumnComponent,
		FileUploadComponent,
		NewVerificationComponent,
    ProtocolViewComponent,
    DuplicateViewComponent,
    DuplicatViewDialogComponent,
    DetailViewComponent,
    BadgeComponent,
    CounterDialogDataComponent,
    EndStateDialogComponent,
    StartStateDialogComponent
	],
	declarations: [
		SortTableDirective,
		FilterTableDirective,
		TableComponent,
		InputComponent,
		ColumnComponent,
		FileUploadComponent,
		UploadDialogComponent,
		NewVerificationComponent,
		NewVerificationDialogComponent,
    ProtocolViewComponent,
    ProtocolDialogComponent,
    VerificationViewComponent,
    DetailViewComponent,
    DetailViewDialogComponent,
    DuplicateViewComponent,
    DuplicatViewDialogComponent,
    BadgeComponent,
    CounterDialogDataComponent,
    EndStateDialogComponent,
    StartStateDialogComponent,
    ScanUploadComponent,
    SelectDialogComponent,
    SealEditComponent,
    UserInfoComponent,
    AddEmployeeComponent,
    AddStationComponent,
    DeleteDialogComponent,
    AddCityComponent,
    AddContractorComponent
	],
  entryComponents: [
    UploadDialogComponent,
    NewVerificationDialogComponent,
    ProtocolDialogComponent,
    DuplicatViewDialogComponent,
    DetailViewDialogComponent,
    CounterDialogDataComponent,
    EndStateDialogComponent,
    StartStateDialogComponent,
    DeleteDialogComponent,
    AddEmployeeComponent,
    SealEditComponent,
    UserInfoComponent,
    AddStationComponent,
    AddCityComponent,
    AddContractorComponent
  ]
})
export class UiModule { }

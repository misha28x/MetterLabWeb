import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd';

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
import { DetailViewComponent, DetailViewDialogComponent } from './components/detail-view';
import { DuplicateViewComponent, DuplicatViewDialogComponent } from './components/duplicate-view';
import { VerificationViewComponent } from './components/verification-view';
import { BadgeComponent } from './components/badge';

import {
  CounterDialogDataComponent,
  EndStateDialogComponent,
  ProtocolDialogComponent,
  ProtocolViewComponent,
  StartStateDialogComponent
} from './components/protocol-view';

import { ScanUploadComponent } from './components/scan-upload';
import { SelectDialogComponent } from './components/select-dialog';
import { UserInfoComponent } from './components/user-info';
import { AddEmployeeComponent } from './components/add-employee';
import { AddStationComponent } from './components/add-station';
import { DeleteDialogComponent } from './components/delete-dialog';
import { AddCityComponent } from './components/add-city/add-city.component';
import { AddContractorComponent } from './components/add-contractor/add-contractor.component';
import { RejectionDialogComponent } from './components/rejection-dialog/rejection-dialog.component';
import { StatusViewComponent } from './status-view/status-view.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { ChangeStationNumberComponent } from './components/change-station-number/change-station-number.component';
import { ChangeTaskDateComponent } from './components/change-task-date/change-task-date.component';
import { SourceService } from '../services/source.service';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    TimepickerModule.forRoot()
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
    UserInfoComponent,
    AddEmployeeComponent,
    AddStationComponent,
    DeleteDialogComponent,
    AddCityComponent,
    AddContractorComponent,
    RejectionDialogComponent,
    StatusViewComponent,
    StatusDialogComponent,
    ChangeStationNumberComponent,
    ChangeTaskDateComponent
  ],
  providers: [SourceService],
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
    UserInfoComponent,
    AddStationComponent,
    AddCityComponent,
    AddContractorComponent,
    RejectionDialogComponent,
    StatusDialogComponent,
    ChangeStationNumberComponent,
    ChangeTaskDateComponent
  ]
})
export class UiModule {}

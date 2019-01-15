import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './../material/material.module';

import { TableComponent } from './components/table';
import { ColumnComponent } from './components/table/column/column.component';
import { InputComponent } from './components/input';
import { FileUploadComponent } from './components/file-upload';

import { FilterTableDirective } from './directives/filter-table/filter-table.directive';
import { SortTableDirective } from './directives/sort-table/sort-table.directive';
import { UploadDialogComponent } from './components/file-upload/upload-dialog/upload-dialog.component';
import { NewVerificationComponent, NewVerificationDialogComponent } from './components/new-verification';
import { ProtocolViewComponent, ProtocolDialogComponent } from './components/protocol-view';
import { VerificationViewComponent } from './components/verification-view/verification-view.component';
import { TaskListViewComponent, TaslListViewDialogComponent } from './components/task-list-view';
import { TaskListEditComponent, TaskListEditDialogComponent } from './components/task-list-edit';
import { DetailViewComponent, DetailViewDialogComponent } from './components/detail-view';
import { DuplicateViewComponent, DuplicatViewDialogComponent } from './components/duplicate-view';
import { BadgeComponent } from './components/badge';

@NgModule({
	imports: [MaterialModule, CommonModule, BrowserModule, FormsModule, ReactiveFormsModule],
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
    BadgeComponent
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
    TaskListViewComponent,
    TaslListViewDialogComponent,
    TaskListEditComponent,
    TaskListEditDialogComponent,
    DetailViewComponent,
    DetailViewDialogComponent,
    DuplicateViewComponent,
    DuplicatViewDialogComponent,
    BadgeComponent
	],
  entryComponents: [UploadDialogComponent, NewVerificationDialogComponent, ProtocolDialogComponent, DuplicatViewDialogComponent]
})
export class UiModule { }

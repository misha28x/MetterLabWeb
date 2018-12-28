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
import { ProtocolViewComponent } from './components/protocol-view';
import { ProtocolDialogComponent } from './components/protocol-view/protocol-dialog/protocol-dialog.component';
import { VerificationViewComponent } from './components/verification-view/verification-view.component';
import { TaskListViewComponent } from './components/task-list-view/task-list-view.component';
import { TaslListViewDialogComponent } from './components/task-list-view/tasl-list-view-dialog/tasl-list-view-dialog.component';
import { TaskListEditComponent } from './components/task-list-edit/task-list-edit.component';
import { TaskListEditDialogComponent } from './components/task-list-edit/task-list-edit-dialog/task-list-edit-dialog.component';

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
    ProtocolViewComponent
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
    TaskListEditDialogComponent
	],
	entryComponents: [UploadDialogComponent, NewVerificationDialogComponent, ProtocolDialogComponent]
})
export class UiModule { }

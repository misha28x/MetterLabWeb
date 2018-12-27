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
    VerificationViewComponent
	],
	entryComponents: [UploadDialogComponent, NewVerificationDialogComponent, ProtocolDialogComponent]
})
export class UiModule { }

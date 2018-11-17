import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './../material/material.module';

import { TableComponent } from './components/table';
import { ColumnComponent } from './components/table/column/column.component';
import { InputComponent } from './components/input';

import { FilterTableDirective } from './directives/filter-table/filter-table.directive';
import { SortTableDirective } from './directives/sort-table/sort-table.directive';

@NgModule({
	imports: [MaterialModule, CommonModule, BrowserModule, FormsModule],
	exports: [
		SortTableDirective,
		FilterTableDirective,
		TableComponent,
		InputComponent,
		ColumnComponent
	],
	declarations: [
		SortTableDirective,
		FilterTableDirective,
		TableComponent,
		InputComponent,
		ColumnComponent
	]
})
export class UiModule { }

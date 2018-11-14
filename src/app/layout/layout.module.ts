import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';

import { DefaultLayoutComponent } from './default';
import { SidebarComponent } from './components/sidebar';
import { NavbarComponent } from './components/navbar';
import { MenuComponent } from './components/menu';

@NgModule({
	declarations: [
		DefaultLayoutComponent,
		SidebarComponent,
		NavbarComponent,
		MenuComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule
	]
})
export class LayoutModule { }

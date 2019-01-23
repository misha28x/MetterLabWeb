import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { MenuReducer } from './store/reducers/menu.reducer';

import { LayoutModule } from './layout/layout.module';
import { RoutingModule, ROUTES } from './routing/routing.module';
import { PagesModule } from './pages/pages.module';
import { UiModule } from './ui/ui.module';

import { AppComponent } from './app.component';
import { EndStateDialogComponent } from './end-state-dialog/end-state-dialog.component';
import { StartStateDialogComponent } from './start-state-dialog/start-state-dialog.component';
import { CounterDialogDataComponent } from './counter-dialog-data/counter-dialog-data.component';

@NgModule({
	declarations: [
		AppComponent,
		EndStateDialogComponent,
		StartStateDialogComponent,
		CounterDialogDataComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(ROUTES, { useHash: true }),
		BrowserAnimationsModule,
		HttpClientModule,
		UiModule,
		StoreModule.forRoot({
			menuState: MenuReducer
		}),
		LayoutModule,
		RoutingModule,
		PagesModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }

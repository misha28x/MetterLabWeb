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

import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(ROUTES, { useHash: true }),
		BrowserAnimationsModule,
		HttpClientModule,
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

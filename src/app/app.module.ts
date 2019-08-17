import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { MenuReducer } from './store/reducers/menu.reducer';
import { permissionReducer } from './store/reducers/permission.reducer';

import { LayoutModule } from './layout/layout.module';
import { ROUTES, RoutingModule } from './routing/routing.module';
import { PagesModule } from './pages/pages.module';
import { UiModule } from './ui/ui.module';

import { AppComponent } from './app.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { reconnect: true } };

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
    SocketIoModule.forRoot(config),
		RouterModule.forRoot(ROUTES, { useHash: true }),
		BrowserAnimationsModule,
		HttpClientModule,
		UiModule,
		StoreModule.forRoot({
      menuState: MenuReducer,
      permission: permissionReducer
		}),
		LayoutModule,
		RoutingModule,
    PagesModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }

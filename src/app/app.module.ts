import { BrowserModule } from '@angular/platform-browser';

import { NzDatePickerModule, NZ_DATE_CONFIG } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';

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
registerLocaleData(uk);

const config: SocketIoConfig = {
  url: 'http://165.22.83.21:3000',
  options: { reconnect: true }
};

@NgModule({
  declarations: [AppComponent],
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
    PagesModule,
    NzDatePickerModule,
    FormsModule
  ],
  providers: [{ provide: NZ_DATE_CONFIG, useValue: { firstDayOfWeek: 1 } }],
  bootstrap: [AppComponent]
})
export class AppModule {}

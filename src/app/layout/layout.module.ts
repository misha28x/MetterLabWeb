import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { MaterialModule } from '../material/material.module';

import { DefaultLayoutComponent } from './default';
import { SidebarComponent } from './components/sidebar';
import { NavbarComponent } from './components/navbar';
import { MenuComponent } from './components/menu';
import { UiModule } from '../ui/ui.module';
import { ExtraComponent } from './extra';
import { SharedComponent } from './shared/shared.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DefaultLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    MenuComponent,
    ExtraComponent,
    SharedComponent
  ],
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    RouterModule,
    MaterialModule,
    UiModule,
    FormsModule
  ]
})
export class LayoutModule {}

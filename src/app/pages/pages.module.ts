import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MaterialModule } from '../material/material.module';
import { UiModule } from './../ui/ui.module';

import { PageHomePageComponent } from './home-page';
import { PageNewVerificationsComponent } from './new-verifications';
import { PageLabRequestsComponent } from './lab-requests';
import { PageProviderRequestsComponent } from './provider-requests';
import { PageVerificationsProtocolsComponent } from './verifications-protocols';
import { PageRejectedProtocolsComponent } from './rejected-protocols';
import { PageTaskPlaningComponent } from './task-planing';
import { PageStationsTasksComponent } from './stations-tasks';
import { PageBrigadeTasksComponent } from './brigade-tasks';
import { PageRejectedVerificationComponent } from './rejected-verification';
import { PageVerificationsArchiveComponent } from './verifications-archive';
import { PageReportsComponent } from './reports';
import { PageUserGuideComponent } from './user-guide';

@NgModule({
	imports: [MaterialModule, NgxChartsModule, UiModule],
	declarations: [
		PageHomePageComponent,
		PageNewVerificationsComponent,
		PageLabRequestsComponent,
		PageProviderRequestsComponent,
		PageVerificationsProtocolsComponent,
		PageRejectedProtocolsComponent,
		PageTaskPlaningComponent,
		PageStationsTasksComponent,
		PageBrigadeTasksComponent,
		PageRejectedVerificationComponent,
		PageVerificationsArchiveComponent,
		PageReportsComponent,
		PageUserGuideComponent
	]
})
export class PagesModule { }

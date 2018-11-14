import { NgModule } from '@angular/core';

import { MaterialModule } from '../material/material.module';

import { PageHomePageComponent } from './home-page';
import { PageNewVerificationsComponent } from './new-verifications';
import { PageLabRequestsComponent } from './lab-requests';
import { PageProviderRequestsComponent } from './provider-requests';
import { PageVerificationsProtocolsComponent } from './verifications-protocols';
import { PageRejectedProtocolsComponent } from './rejected-protocols';
import { PageTaskPlaningComponent } from './task-planing';
import { PageStationsTasksComponent } from './stations-tasks';
import { PageBrigadeTasksComponent } from './brigade-tasks';
import { PageEmployeeComponent } from './employee';
import { PageDisbrigadeDictationaryComponent } from './dis-brigade-dictationary';
import { PageRejectedVerificationComponent } from './rejected-verification';
import { PageVerificationsArchiveComponent } from './verifications-archive';
import { PageReportsComponent } from './reports';
import { PageUploadDataComponent } from './upload-data';
import { PageUserGuideComponent } from './user-guide';

@NgModule({
	imports: [MaterialModule],
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
		PageEmployeeComponent,
		PageDisbrigadeDictationaryComponent,
		PageRejectedVerificationComponent,
		PageVerificationsArchiveComponent,
		PageReportsComponent,
		PageUploadDataComponent,
		PageUserGuideComponent
	]
})
export class PagesModule { }

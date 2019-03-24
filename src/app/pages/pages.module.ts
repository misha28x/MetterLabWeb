import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { MaterialModule } from '../material/material.module';
import { UiModule } from './../ui/ui.module';

import { PageHomePageComponent } from './home-page';
import { PageNewVerificationsComponent, EmployeeDialogComponent } from './new-verifications';
import { PageLabRequestsComponent } from './lab-requests';
import { PageProviderRequestsComponent } from './provider-requests';
import { PageVerificationsProtocolsComponent } from './verifications-protocols';
import { PageRejectedProtocolsComponent } from './rejected-protocols';
import { PageTaskPlaningComponent, TaskSendingComponent } from './task-planing';
import { PageStationsTasksComponent, TaslListViewDialogComponent, TaskListEditDialogComponent } from './stations-tasks';
import { PageBrigadeTasksComponent } from './brigade-tasks';
import { PageRejectedVerificationComponent } from './rejected-verification';
import { PageVerificationsArchiveComponent } from './verifications-archive';
import { PageReportsComponent } from './reports';
import { PageUserGuideComponent } from './user-guide';
import { AuthorizationPageComponent } from './authorization-page';
import { MetrologyProtocolsComponent } from './metrology-protocols';
import { FailedTasksComponent } from './failed-tasks';
import { ProvidersPageComponent } from './providers-page';
import { FinishedVerificationsComponent } from './finished-verifications';

import { ScanUploadComponent } from '../ui/components/scan-upload';
import { SelectDialogComponent } from '../ui/components/select-dialog';
import { PageEmployeesComponent } from './employees/employees.component';
import { InfoPageComponent } from './info-page/info-page.component';

@NgModule({
  imports: [MaterialModule, NgxChartsModule, UiModule, FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot()],
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
    PageUserGuideComponent,
    EmployeeDialogComponent,
    TaskSendingComponent,
    TaslListViewDialogComponent,
    TaskListEditDialogComponent,
    AuthorizationPageComponent,
    MetrologyProtocolsComponent,
    FailedTasksComponent,
    ProvidersPageComponent,
    FinishedVerificationsComponent,
    PageEmployeesComponent,
    InfoPageComponent
  ],
  entryComponents: [
    EmployeeDialogComponent,
    TaskSendingComponent,
    TaslListViewDialogComponent,
    TaskListEditDialogComponent,
    ScanUploadComponent,
    SelectDialogComponent
  ]
})
export class PagesModule { }

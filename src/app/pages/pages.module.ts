import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd';

import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../material/material.module';
import { UiModule } from './../ui/ui.module';

import { PageHomePageComponent } from './home-page';
import { EmployeeDialogComponent, PageNewVerificationsComponent } from './new-verifications';
import { PageLabRequestsComponent } from './lab-requests';
import { PageProviderRequestsComponent } from './provider-requests';
import { PageVerificationsProtocolsComponent } from './verifications-protocols';
import { PageRejectedProtocolsComponent } from './rejected-protocols';
import { PageTaskPlaningComponent, TaskSendingComponent } from './task-planing';
import { PageStationsTasksComponent } from './stations-tasks/stations-tasks.component';
import { TaslListViewDialogComponent } from './stations-tasks/tasl-list-view-dialog/tasl-list-view-dialog.component';
import { TaskListEditDialogComponent } from './stations-tasks/task-list-edit-dialog/task-list-edit-dialog.component';

import { PageRejectedVerificationComponent } from './rejected-verification';
import { PageVerificationsArchiveComponent } from './verifications-archive';
import { PageReportsComponent } from './reports';

import { AuthorizationPageComponent } from './authorization-page';
import { MetrologyProtocolsComponent } from './metrology-protocols';
import { FailedTasksComponent } from './failed-tasks';
import { ProvidersPageComponent } from './providers-page';
import { FinishedVerificationsComponent } from './finished-verifications';

import { ScanUploadComponent } from '../ui/components/scan-upload';
import { SelectDialogComponent } from '../ui/components/select-dialog';
import { PageEmployeesComponent } from './employees';
import { InfoPageComponent } from './info-page';
import { StatusPageComponent } from './status-page';
import { VerificationFormComponent } from './verification-form';
import { ProfileComponent } from './profile/profile.component';
import { PageMetrologyArchiveComponent } from './metrology-archive/metrology-archive.component';
import { MetrologyReportsComponent } from './metrology-reports/metrology-reports.component';
import { MetrologyRejectedComponent } from './metrology-rejected/metrology-rejected.component';

@NgModule({
  imports: [
    MaterialModule,
    NgxChartsModule,
    HttpClientModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule
  ],
  declarations: [
    PageHomePageComponent,
    PageNewVerificationsComponent,
    PageLabRequestsComponent,
    PageProviderRequestsComponent,
    PageVerificationsProtocolsComponent,
    PageRejectedProtocolsComponent,
    PageTaskPlaningComponent,
    PageStationsTasksComponent,
    PageRejectedVerificationComponent,
    PageVerificationsArchiveComponent,
    PageReportsComponent,
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
    InfoPageComponent,
    StatusPageComponent,
    VerificationFormComponent,
    ProfileComponent,
    PageMetrologyArchiveComponent,
    MetrologyReportsComponent,
    MetrologyRejectedComponent
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
export class PagesModule {}

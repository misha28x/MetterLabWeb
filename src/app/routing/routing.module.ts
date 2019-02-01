import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageUserGuideComponent } from './../pages/user-guide/user-guide.component';
import { PageReportsComponent } from './../pages/reports/reports.component';
import { PageVerificationsArchiveComponent } from './../pages/verifications-archive/verifications-archive.component';
import { PageRejectedProtocolsComponent } from './../pages/rejected-protocols/rejected-protocols.component';
import { PageBrigadeTasksComponent } from './../pages/brigade-tasks/brigade-tasks.component';
import { PageStationsTasksComponent } from './../pages/stations-tasks/stations-tasks.component';
import { DefaultLayoutComponent } from '../layout/default';
import { PageHomePageComponent } from '../pages/home-page';
import { PageNewVerificationsComponent } from '../pages/new-verifications';
import { PageLabRequestsComponent } from '../pages/lab-requests';
import { PageProviderRequestsComponent } from '../pages/provider-requests';
import { PageVerificationsProtocolsComponent } from '../pages/verifications-protocols';
import { PageTaskPlaningComponent } from '../pages/task-planing';
import { AuthorizationPageComponent } from '../pages/authorization-page';
import { MetrologyProtocolsComponent } from '../pages/metrology-protocols';
import { ExtraComponent } from '../layout/extra/extra.component';

export const DEFAULT_ROUTES = [
	{ path: 'home', component: PageHomePageComponent, data: { title: 'Головна Панель' } },
	{ path: 'new-verifications', component: PageNewVerificationsComponent, data: { title: 'Нові Повірки' }  },
	{ path: 'lab-requests', component: PageLabRequestsComponent, data: { title: 'Заявки Вимірювальної Лабораторії' } },
	{ path: 'provides-requests', component: PageProviderRequestsComponent, data: { title: 'Заявки Для Надавача Послуг' } },
	{ path: 'verications-protocols', component: PageVerificationsProtocolsComponent, data: { title: 'Електроні Протоколи Повірок' } },
	{ path: 'rejected-protocols', component: PageRejectedProtocolsComponent, data: { title: 'Відхилені Протоколи' } },
	{ path: 'tasks-planing', component: PageTaskPlaningComponent, data: { title: 'Планування Завдання' } },
	{ path: 'station-tasks', component: PageStationsTasksComponent, data: { title: 'Завдання Для Станцій' } },
	{ path: 'brigade-tasks', component: PageBrigadeTasksComponent, data: { title: 'Завдання Для Бригад' } },
	{ path: 'rejected-verification', component: PageRejectedProtocolsComponent, data: { title: 'Відхилені Повірки' } },
	{ path: 'verifications-archive', component: PageVerificationsArchiveComponent, data: { title: 'Архів Повірок' } },
	{ path: 'reports', component: PageReportsComponent, data: { title: 'Звіти' } },
  { path: 'user-guide', component: PageUserGuideComponent, data: { title: 'Інструкція Користувача' } },
  { path: 'metrology', component: MetrologyProtocolsComponent }
];

export const EXTRA_ROUTES = [
  { path: 'auth', component: AuthorizationPageComponent }
];

export const ROUTES: Routes = [
	{
		path: '',
		redirectTo: 'extra/auth',
		pathMatch: 'full'
	},
	{
		path: 'default',
		component: DefaultLayoutComponent,
		children: DEFAULT_ROUTES
	},
  {
    path: 'extra',
    component: ExtraComponent,
    children: EXTRA_ROUTES
  }
];

@NgModule({
	imports: [],
	exports: [RouterModule],
	declarations: [],
	providers: []
})
export class RoutingModule { }

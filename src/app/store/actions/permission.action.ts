import { Action } from '@ngrx/store';

export enum PermissionTypes {
  ServiceProvider = '[Login] SeviceProvider',
  Unauthorized = '[Login] Unauthorized',
  Metrology = '[Login] Metrology',
  Admin = '[Login] Admin',
  User = '[Login] User '
}

export class Admin implements Action {
  readonly type = PermissionTypes.Admin;
}

export class Metrology implements Action {
  readonly type = PermissionTypes.Metrology;
}

export class User implements Action {
  readonly type = PermissionTypes.User;
}

export class Unauthorized implements Action {
  readonly type = PermissionTypes.Unauthorized;
}

export class ServiceProvider implements Action {
  readonly type = PermissionTypes.ServiceProvider;
}

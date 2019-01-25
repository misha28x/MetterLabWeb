import { Action } from '@ngrx/store';

export const METROLOGY = '[User] Metrology';
export const ADMIN = '[User] Admin';
export const USER = '[User] User';

export class Admin implements Action {
  readonly type = ADMIN;
}

export class Metrology implements Action {
  readonly type = METROLOGY;
}

export class User implements Action {
  readonly type = USER;
}

export type ALL = Admin | Metrology | User;

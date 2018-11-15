import { Action } from '@ngrx/store';

export const OPEN = '[Menu] Open';
export const CLOSE = '[Menu] Close';

export class Open implements Action {
	readonly type = OPEN;
}

export class Close implements Action {
	readonly type = CLOSE;
}

export type All = Open | Close;

import * as MenuAction from '../actions/menu.actions';

export type Action = MenuAction.All;

const DEFAULT_STATE: Boolean = true;

export function MenuReducer(state: Boolean = DEFAULT_STATE, action: Action): Boolean {
	switch (action.type) {
		case MenuAction.OPEN: {
			state = true;
			return state;
		}
		case MenuAction.CLOSE: {
			state = false;
			return state;
		}
		default: {
			state = false;
			return state;
		}
	}
}

import * as MenuAction from '../actions/menu.actions';

export type Action = MenuAction.All;

const DEFAULT_STATE: Boolean = false;

export function MenuReducer(state: Boolean = DEFAULT_STATE, action: Action): Boolean {
	switch (action.type) {
		case MenuAction.OPEN: {
			state = true;
			return state;
		}
		case MenuAction.CLOSE: {
			state = false;
			return ;
		}
		default: {
			state = true;
			return state;
		}
	}
}

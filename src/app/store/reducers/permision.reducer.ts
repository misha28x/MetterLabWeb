import * as PermisionAction from '../actions/permision.action';

export type Action = PermisionAction.ALL;

const DEFAULT_STATE: string = 'user';

export function PermisionReducer(state: string = DEFAULT_STATE, action: Action): string {
  switch (action.type) {
    case PermisionAction.USER: {
      state = 'user';
      return state;
    }
    case PermisionAction.METROLOGY: {
      state = 'metrology';
      return state;
    }
    case PermisionAction.ADMIN: {
      state = 'admin';
      return state;
    }
    default: {
      state = 'user';
      return state;
    }
  }
}

import * as permissionAction from '../actions/permission.action';

export type Action = permissionAction.ALL;

const DEFAULT_STATE: number = 3;

export function permissionReducer(state: number = DEFAULT_STATE, action: Action): number {
  switch (action.type) {
    case permissionAction.USER: {
      state = 1; 
      return state;
    }
    case permissionAction.METROLOGY: {
      state = 2; 
      return state;
    }
    case permissionAction.ADMIN: {
      state = 3;
      return state;
    }
    default: {
      state = state;
      return state;
    }
  }
}

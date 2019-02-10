import { Action } from '@ngrx/store';

import { PermissionTypes } from '../actions/permission.action';

const DEFAULT_STATE: number = 0;

export function permissionReducer(state: number = DEFAULT_STATE, action: Action): number {
  switch (action.type) {
    case PermissionTypes.Unauthorized: {
      state = 0;
      return state;
    }
    case PermissionTypes.User: {
      state = 1; 
      return state;
    }
    case PermissionTypes.ServiceProvider: {
      state = 2; 
      return state;
    }
    case PermissionTypes.Metrology: {
      state = 3; 
      return state;
    }
    case PermissionTypes.Admin: {
      state = 4;
      return state;
    }
    default: {
      state = state;
      return state;
    }
  }
}

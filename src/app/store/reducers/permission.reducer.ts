import { PermissionTypes } from '../actions/permission.action';
import { User } from '../../interfaces/user';

const DEFAULT_STATE: User = { 
  permission: 0
};

export function permissionReducer(
  state: User = DEFAULT_STATE,
  action: { payload: {username: string, serviceProvider: string}, type: PermissionTypes }): User {
  console.log(action.payload);
  switch (action.type) {
    case PermissionTypes.Unauthorized: {
      state = { permission: 0 };
      return state;
    }
    case PermissionTypes.User: {
      state = { 
        permission: 1,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider
      };

      return state;
    }
    case PermissionTypes.ServiceProvider: {
      state = {
        permission: 2,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider
      };

      return state;
    }
    case PermissionTypes.Metrology: {
      state = {
        permission: 3,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider
      };

      return state;
    }

    case PermissionTypes.Admin: {
      state = { 
        permission: 4,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider
      };
      
      return state;
    }
    default: {
      return { ...state };
    }
  }
}

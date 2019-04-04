import { PermissionTypes } from '../actions/permission.action';
import { User } from '../../interfaces/user';

const DEFAULT_STATE: User = { 
  permission: 0
};

export function permissionReducer(
  state: User = DEFAULT_STATE,
  action: { payload: {username: string, serviceProvider: string, id: string}, type: PermissionTypes }): User {
  switch (action.type) {
    case PermissionTypes.Unauthorized: {
      state = { permission: 0 };
      return state;
    }

    case PermissionTypes.SuperAdmin: {
      state = {
        permission: 1,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        createFor: action.payload.serviceProvider,
        userId: action.payload.id
      };

      return state;
    }

    case PermissionTypes.Admin: {
      state = {
        permission: 2,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        createFor: action.payload.serviceProvider,
        userId: action.payload.id
      };

      return state;
    }

    case PermissionTypes.MetrologyMeneger: {
      state = {
        permission: 3,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        createFor: action.payload.serviceProvider,
        userId: action.payload.id
      };
      return state;
    }
    
    case PermissionTypes.Meneger: {
      state = { 
        permission: 4,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        createFor: action.payload.serviceProvider,
        userId: action.payload.id
      };

      return state;
    }

    case PermissionTypes.Metrology: {
      state = {
        permission: 5,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        userId: action.payload.id
      };

      return state;
    }

    case PermissionTypes.ServiceProvider: {
      state = {
        permission: 6,
        username: action.payload.username,
        serviceProvider: action.payload.serviceProvider,
        createFor: '80334',
        userId: action.payload.id
      };

      return state;
    }

    default: {
      return { ...state };
    }
  }
}

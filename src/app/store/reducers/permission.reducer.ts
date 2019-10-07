import { PermissionTypes } from '../actions/permission.action';
import { IUser } from '../../interfaces/user';

const DEFAULT_STATE: IUser = {
  permission: 0
};

export function permissionReducer(
  state: IUser = DEFAULT_STATE,
  action: {
    payload: { username: string; serviceProvider: string; id: string };
    type: PermissionTypes;
  }
): IUser {
  switch (action.type) {
    case PermissionTypes.Auth: {
      return {
        ...action.payload,
        createFor: action.payload.serviceProvider
      };
    }

    case PermissionTypes.LogOut: {
      return {
        permission: 0
      };
    }

    default: {
      return { ...state };
    }
  }
}

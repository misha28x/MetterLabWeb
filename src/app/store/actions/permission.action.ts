import { IUser } from '../../interfaces/user';

export enum PermissionTypes {
  Auth = '[Login] Authorization',
  LogOut = '[Login] LogOUt',
  ChangePermission = '[Header] Change Metrology Permission'
}

export const changePermission = ({
  permission,
  createFor
}: Pick<IUser, 'permission' | 'createFor'>) => ({
  type: PermissionTypes.ChangePermission,
  payload: { permission, createFor }
});

export const login = (user: IUser): { type: PermissionTypes; payload: IUser } => ({
  type: PermissionTypes.Auth,
  payload: { ...user }
});

export const logout = () => ({
  type: PermissionTypes.LogOut
});

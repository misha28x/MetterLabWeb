import { IUser } from '../../interfaces/user';

export enum PermissionTypes {
  Auth = '[Login] Authorization',
  LogOut = '[Login] LogOUt'
}

export const login = (user: IUser): { type: PermissionTypes; payload: IUser } => ({
  type: PermissionTypes.Auth,
  payload: { ...user }
});

export const logout = () => ({
  type: PermissionTypes.LogOut
});

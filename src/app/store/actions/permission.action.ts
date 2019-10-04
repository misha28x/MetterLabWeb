import { IUser } from '../../interfaces/user';

export enum PermissionTypes {
  ServiceProvider = '[Login] SeviceProvider',
  Unauthorized = '[Login] Unauthorized',
  Metrology = '[Login] Metrology',
  Admin = '[Login] Admin',
  SuperAdmin = '[Login] SuperAdmin',
  MetrologyMeneger = '[Login] M-Meneger',
  Meneger = '[Login] Meneger'
}

const getType = (permission: number) => {
  switch (permission) {
    case 1:
      return PermissionTypes.SuperAdmin;

    case 2:
      return PermissionTypes.Admin;

    case 3:
      return PermissionTypes.MetrologyMeneger;

    case 4:
      return PermissionTypes.Meneger;

    case 5:
      return PermissionTypes.Metrology;

    case 6:
      return PermissionTypes.ServiceProvider;

    default:
      return PermissionTypes.Unauthorized;
  }
};

export const login = (info: IUser) => ({
  type: getType(info.permission),
  payload: { username: info.username, serviceProvider: info.serviceProvider, id: info.userId }
});

export const logout = () => ({
  type: PermissionTypes.Unauthorized
});

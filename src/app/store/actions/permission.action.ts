import { User } from '../../interfaces/user';

export enum PermissionTypes {
  ServiceProvider = '[Login] SeviceProvider',
  Unauthorized = '[Login] Unauthorized',
  Metrology = '[Login] Metrology',
  Admin = '[Login] Admin',
  User = '[Login] User '
}

export const login = (info: User) => ({
  type: getType(info.permission),
  payload: { username: info.username, serviceProvider: info.serviceProvider }
});

const getType = (permission: number) => {
  switch (permission) {
    case 4: 
      return PermissionTypes.Admin;
    
    case 2: 
      return PermissionTypes.ServiceProvider;

    case 3:
      return PermissionTypes.Metrology;

    case 4: 
      return PermissionTypes.User;

    default: 
      return PermissionTypes.Unauthorized;
  }
};

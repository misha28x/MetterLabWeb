export interface IUser {
  user_full_name?: string;
  username?: string;
  permission?: number;
  serviceProvider?: string;
  createFor?: string;
  userId?: string;
  cityId?: string;
  serviceType?: ServiceTypes;
}

export interface IProvider {
  name: string;
  id: string;
}

export interface ClientInfo {
  client?: string;
  email?: string;
  phoneNumber?: string;
  additionalPhone?: string;
  region?: string;
  district?: string;
  settlement?: string;
  cityIndex?: string;
  street?: string;
  house?: string;
  apartment?: string;
}

export enum ServiceTypes {
  ColdWater = 1,
  HotWater = 2,
  Both = 3
}

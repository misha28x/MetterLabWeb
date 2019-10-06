export interface IUser {
  username?: string;
  permission?: number;
  serviceProvider?: any;
  createFor?: string;
  userId?: string;
  district?: string;
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

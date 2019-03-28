export interface User {
  username?: string;
  permission?: number;
  serviceProvider?: string;
  createFor?: string;
}

export interface ClientInfo {
  client?: string;
  email?: string;
  phoneNumber?: string;
  secondNumber?: string;
  region?: string;
  district?: string;
  settlement?: string;
  cityIndex?: string;
  street?: string;
  house?: string;
  apartment?: string;
}

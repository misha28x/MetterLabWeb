export interface VerificationDTO {
  addingDate: string;
  applicationNumber?: string;
  client: string;
  phoneNumber: string;
  additionalPhone: string;
  employeeName: string;
  index: string;
  settlement: string;
  region: string;
  district: string;
  street: string;
  house: string;
  apartment: string;
  montageDate?: string;
  counterQuantity?: any; // Кількість лічильників						\\
  symbol: string; // Умовне_позначення +							\\
  counterNumber: string; // Номер_лічильника +								\\
  haveSeal: string; // Наявність пломби									\\
  counterType: string; // Типорозмір_лічильника +					\\
  productionYear: string; // Рік_випуску_лічильника +					\\
  acumulatedVolume: string; // Накопичений об'єм								\\
  serviceType: number; // Тип послуги +										\\
  status?: string; // Статус +													\\
  serviceProvider: string; // Надавач_послуг + 								\\
  comment: string; // Коментар +												\\
  note: string; // Примітка +												\\
  taskDate?: string; // Дата_завдання +									\\
  stationNumber?: string; // Номер_установки +						    \\
  favorDate: any; // Бажана дата повірки              \\
  favorTime: any; // Бажана дата повірки              \\
  sanitaryWellfare: any; // Справність сантехніки            \\
  waterAbsentTo?: string; // Вода відсутня до...              \\
  entrance: string; // Під'їзд                          \\
  floor: string; // Поверх p                          \\
  // Дані з archive по протоколу
  laboratory?: string; // Уповноважена_повірочна_лабораторі\\
  protocolDate?: string; // Дата створення протоколу					\\
  protocolNumber?: string; // Номер протоколу									\\
  protocolSignDate?: string; // Дата підпису протоколу					 	\\
  sealNumber?: string; // Номер пломби											\\
  suitableFor?: string; // Придатний до											\\
  documentPrintDate?: string; // Дата видачі документу						\\
  idForStation?: number; // id для станції										\\
  positionInTask?: number; // позиція в завданні								\\
  // поля з new-verification-dialog
  isUnique?: any; // ?																\\
  userId?: string;
  createFor?: string;
}

export interface IVerification {
  addingDate: string;
  applicationNumber?: string;
  client: string;
  phoneNumber: string;
  additionalPhone: string;
  employeeName: string;
  settlement: string;
  district: string;
  street: string;
  house: string;
  apartment: string;
  serviceType: string;
  status?: string;
  serviceProvider: string;
  note: string;
  taskDate?: string;
  stationNumber?: string;
  protocolDate?: string;
  protocolNumber?: string;
  suitableFor?: string;
}

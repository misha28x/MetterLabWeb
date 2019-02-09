export interface Verification {
		// TODO: порівняти з вмістом verif-archive і тоді створити нову табличку
		// + - було в обидвох таблицях; \\ - додано в Archive
	addingDate: string; 				// Дата_надходження + 				 			\\
	applicationNumber?: string; 	// Номер_заявки +										\\
	client: string; 						// Клієнт + 												\\
	phoneNumber: string;				// Номер телефону + 								\\
	employeeName: string; 			// ПІБ_Працівника 									\\
	index: string;							// Індекс + 	              				\\
  settlement: string;					// Населений пункт + 								\\
  region: string;             // Область 													\\
	district: string;						// Район 														\\
	street: string;						  // Вулиця + 												\\
	house: string; 							// Будинок + 												\\
  apartment: string; 					// Квартира + 											\\
  isDismantled: boolean; 			// Лічильник_демонтовано +					\\
  montageDate: string;        // Дата монтажу лічильника +				\\
  counterQuantity?: number;   // Кількість лічильників						\\
	symbol: string; 						// Умовне_позначення +							\\
	counterNumber: string; 			// Номер_лічильника +								\\
  haveSeal: boolean;          // Наявність пломби									\\
  counterType: string; 				// Типорозмір_лічильника +					\\
	productionYear: string; 		// Рік_випуску_лічильника +					\\
  acumulatedVolume: string;   // Накопичений об'єм								\\
  serviceType: string;        // Тип послуги +										\\
	status?: string; 						// Статус +													\\
	serviceProvider: string; 		// Надавач_послуг + 								\\
	comment: string;					  // Коментар +												\\
	note: string; 							// Примітка +												\\
	taskDate?: string; 					// Дата_завдання +									\\
	stationNumber?: string; 		// Номер_установки +						    \\
  favorDate: any;             // Бажана дата повірки              \\
  favorTime: any;             // Бажана дата повірки              \\
  sanitaryWellfare: string;   // Справність сантехніки            \\
  waterAbsentTo: string;      // Вода відсутня до...              \\
  entrance: string;           // Під'їзд                          \\
  floor: string;              // Поверх                           \\
	// Дані з archive по протоколу
	laboratory?: string;				// Уповноважена_повірочна_лабораторі\\
	protocolDate?: string;			// Дата створення протоколу					\\
	protocolNumber?: string; 		// Номер протоколу									\\
	protocolSignDate?: string;  // Дата підпису протоколу					 	\\
	sealNumber?: string;				// Номер пломби											\\
	suitableFor?: string;				// Придатний до											\\
	documentPrintDate?: string;	// Дата видачі документу						\\
	idForStation?: number;			// id для станції										\\
	positionInTask?: number;		// позиція в завданні								\\
	// поля з new-verification-dialog
	isUnique?: boolean;					// ?																\\
}

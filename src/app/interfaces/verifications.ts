export interface Verification {
	addingDate: string; 				// Дата_надходження
	applicationNumber: string; 	// Номер_заявки
	client: string; 						// Клієнт
	phoneNumber: string;
	employeeName: string; 			// ПІБ_Працівника
	index: string;
  settlement: string;
	district: string;						// Район
	street: string;						  // Вулиця
	house: string; 							// Будинок
  apartment: string; 					// Квартира
  isDismantled: boolean; 			// Лічильник_демонтовано
  montageDate: string;
	symbol: string; 						// Умовне_позначення
	counterNumber: string; 			// Номер_лічильника
  haveSeal: boolean;          // Наявність пломби
  counterType: string; 				// Типорозмір_лічильника
	productionYear: string; 		// Рік_випуску_лічильника
  acumulatedVolume: string;   // Накопичений об'єм
	status: string; 						// Статус
	serviceProvider: string; 		// Надавач_послуг
	comment: string;					  // Коментар
	note: string; 							// Примітка
	taskDate: string; 					// Дата_завдання
	brigadeName: string; 				// Назва_бригади
	stationNumber: string; 			// Номер_установки
}

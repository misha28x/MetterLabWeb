export interface Verification {
	addingDate: String; 				// Дата_надходження
	applicationNumber: String; 	// Номер_заявки
	client: String; 						// Клієнт
	phoneNumber: String;
	employee: String; 					// ПІБ_Працівника
	index: String;
	city: String;
	district: String;						// Район
	street: String;						  // Вулиця
	house: String; 							// Будинок
	flat: String; 							// Квартира
	isRemoved: boolean; 				// Лічильник_демонтовано
	symbol: String; 						// Умовне_позначення
	counterNumber: String; 			// Номер_лічильника
	type: String; 							// Типорозмір_лічильника
	productionYear: String; 		// Рік_випуску_лічильника
	status: String; 						// Статус
	serviceProvider: String; 		// Надавач_послуг
	comment: String;					  // Коментар
	note: String; 							// Примітка
	taskDate: Date; 						// Дата_завдання
	brigadeName: String; 				// Назва_бригади
	stationNumber: String; 			// Номер_установки
}

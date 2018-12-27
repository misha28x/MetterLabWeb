export interface StationTask {
	taskDate: String;					// Дата_завдання
	type: String; 						// Тип_установки
	number: String;						// Номер_установки
	employeeName: String; 		// ПІБ_контактної_особи
	phoneNumber: String;			// Номер_телефону
	count: number;						// Кількість_заявок
}

export interface BrigadeTask {
	taskDate: String;					// Дата_завдання
	type: String; 						// Тип_установки
	name: String;						// Назва_бригади
	employeeName: String; 		// ПІБ_контактної_особи
	phoneNumber: String;			// Номер_телефону
	count: number;						// Кількість_заявок
}

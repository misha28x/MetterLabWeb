export interface Protocol {
	date: Date;								// Повна дата
	day: number; 							// День
	type: String; 						// Тип
	year: number; 						// Рік
	hours: number; 						// Години
	month: number; 						// Місяць
	minutes: number; 					// Хвилини
	counterNumber: String;	 	// Номер лічильника
	capacity: number; 				// Об'єм
	temperature: number; 			// Температура
	productionYear: number; 	// Рік виробітку
	deviceNumber: number;		 	// Номер пристрою
	tests: Test[];						// Масив з тестами
	status: String; 					// Статус
	result: String; 					// Результат
	protocolStatus: Boolean; 	// Статус протоколу
}

export interface Test {
	name: String;
	installedExes: number; 		// "Заданный расход, м3/ч";				[0]
	assumedFault: number; 		// "Допустимая погрешность, +-%"; [1]
	etalonCapacity: number; 	// "Объем эталона, л";
	initValue: number; 				// "Начальное значение, л";
	finalValue: number; 			// "Конечное значение, л";
	counterCapacity: number;	// "Объем по счётчику, л";
	testDuration: number; 		// "Продолжительность теста, с";
	mediumExes: number; 			// "Средний расход, м3/ч";
	isInZone: String; 				// "Статус расхода";
	calculatedFault: number; 	// "Расчётная погрешность, %";
	result: String;
	startStateImage: String;
	endStateImage: String;
}

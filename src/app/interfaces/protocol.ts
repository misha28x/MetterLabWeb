export interface Protocol {
	applicationNumber?: string; // Номер заявки
	serviceType?: number;			// Тип послуги
	acumulatedVolume?: string // Накопичений об'єм
	bbiFileName: string;			// Номер_протоколу
	date: Date;								// Повна дата
	day: number; 							// День
	type: string; 						// Типорозмір
	symbol: string;						// Умовне позначення
	year: number; 						// Рік
	hours: number; 						// Години
	month: number; 						// Місяць
	minutes: number; 					// Хвилини
	counterNumber: string;	 	// Номер лічильника
	capacity: string; 				// Об'єм
	image: String;
	temperature: number; 			// Температура
	productionYear: number; 	// Рік виробітку
	longitude: number;				// Довгота
	latitude: number;					// Широта
	deviceNumber: number;		 	// Номер пристрою
	tests: Test[];						// Масив з тестами
	isInZone: string; 					// Статус
	result: string; 					// Результат
	protocolStatus: Boolean; 	// Статус протоколу
}

export interface Test {
	bbiFileName: string;			// Номер_протоколу
	name: string;							// Назва_тесту
	installedExes: number; 		// "Заданный расход, м3/ч";				[0]
	assumedFault: number; 		// "Допустимая погрешность, +-%"; [1]
	etalonCapacity: number; 	// "Объем эталона, л";
	initValue: number; 				// "Начальное значение, л";
	finalValue: number; 			// "Конечное значение, л";
	counterCapacity: number;	// "Объем по счётчику, л";
	testDuration: number; 		// "Продолжительность теста, с";
	mediumExes: number; 			// "Средний расход, м3/ч";
	isInZone: string; 				// "Статус расхода";
	calculatedFault: number; 	// "Расчётная погрешность, %";
	result: string;
	startStateImage: string;
	endStateImage: string;
}

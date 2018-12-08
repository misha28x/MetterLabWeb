export interface Protocol {
	date: Date;
	day: number;
	type: String;
	year: number;
	hours: number;
	month: number;
	minutes: number;
	counterNumber: number;
	capacity: number;
	temperature: number;
	productionYear: number;
	deviceNumber: number;
	tests: Test[];
	status: String;
	result: String;
	protocolStatus: Boolean;
}

export interface Test {
	name: String;
	installedExes: number; 		// "Заданный расход, м3/ч";
	assumedFault: number; 		// "Допустимая погрешность, +-%";
	etalonCapacity: number; 	// "Объем эталона, л";
	initValue: number; 				// "Начальное значение, л";
	finalValue: number; 			// "Конечное значение, л";
	counterCapacity: number;	// "Объем по счётчику, л";
	testDuration: number; 		// "Продолжительность теста, с";
	mediumExes: number; 			// "Средний расход, м3/ч";
	isInZone: String; 				// "Статус расхода";
	calculatedFault: number; 	// "Расчётная погрешность, %";
	result: String;
	startStateImage: ImageBitmap;
	endStateImage: ImageBitmap;
}

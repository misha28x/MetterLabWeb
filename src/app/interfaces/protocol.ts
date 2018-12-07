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
	installedExes: number;
	assumedFault: number;
	etalonCapacity: number;
	initValue: number;
	finalValue: number;
	counterCapacity: number;
	testDuration: number;
	mediumExes: number;
	isInZone: String;
	result: String;
	startStateImage: ImageBitmap;
	endStateImage: ImageBitmap;
}

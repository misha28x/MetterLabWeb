interface Protocol {
	date: Date;
	day: Number;
	type: String;
	year: Number;
	hours: Number;
	month: Number;
	minutes: Number;
	counterNumber: Number;
	capacity: Number;
	temperature: Number;
	deviceNumber: Number;
	tests: Test[];
	status: String;
	result: String;
	protocolStatu: Boolean;
}

interface Test {
	name: string;
	installedExes: Number;
	assumedFault: Number;
	etalonCapacity: Number;
	initValue: Number;
	finalValue: Number;
	counterCapacity: Number;
	testDuration: Number;
	mediumExes: Number;
	isInZone: String;
	startStateImage: ImageBitmap;
	endStateImage: ImageBitmap;
}

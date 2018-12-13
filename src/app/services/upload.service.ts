import { Injectable, Testability } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Protocol, Test } from '../interfaces/protocol';

const url = 'http://localhost:3000/api/upload';

@Injectable({
	providedIn: 'root'
})
export class UploadService {

	constructor(private http: HttpClient) { }
	
	public upload(files: Set<File>): void {
		// let fileCounter = 0;
		const reader = new FileReader();
		let fileName: string;

		reader.onload = (event) => {
			const tests: Test[] = [];

			const protocol: Protocol = {
				bbiFileName: '',
				capacity: 0,
				counterNumber: '',
				date: new Date(),
				day: 0,
				deviceNumber: 0,
				hours: 0,
				minutes: 0,
				month: 0,
				productionYear: 0,
				protocolStatus: undefined,
				result: '',
				status: '',
				temperature: 0,
				tests: tests,
				type: '',
				year: 0
			};

			const byteArray = <ArrayBuffer>reader.result;
			const bbiFile = new Uint8Array(byteArray);
			// Дата
			protocol.day = bbiFile[0];
			protocol.month = bbiFile[1];
			protocol.year = (bbiFile[2] | bbiFile[3] << 8);
			protocol.hours = bbiFile[4];
			protocol.minutes = bbiFile[5];

			// Дата
			const date = new Date((bbiFile[2] | bbiFile[3] << 8), bbiFile[1], bbiFile[0], bbiFile[4], bbiFile[5]);
			protocol.date = date;

			// Номер счётчика
			const counter = bbiFile.slice(72, 84);
			let protocolCounter;
			for (let i = 0; i < counter.byteLength; i++) {
				protocolCounter += String.fromCharCode(counter[i]);
			}
			const ppss = protocolCounter.replace(/[^-0-9]/gim, '');
			protocol.counterNumber = ppss;
			// Температура
			const temp = bbiFile.slice(20, 24);
			protocol.temperature = this.bytesToInt(temp);
			// Накоплений об'єм
			const liter = bbiFile.slice(96, 104);
			protocol.capacity = this.bytesToInt(liter);
			// Тип лічильника
			const countType = bbiFile.slice(104, 110);
			const countType2 = bbiFile.slice(112, 116);
			protocol.type = this.uintToString(countType) + 'КВ' + this.uintToString(countType2);
			// Рік виробництва
			const year = bbiFile.slice(124, 128);
			protocol.productionYear = this.bytesToInt(year);
			// Номер установки
			const deviceNumber = bbiFile.slice(68, 72);
			protocol.deviceNumber = this.bytesToInt(deviceNumber);

			/*
			// Широта
			const lat = bbiFile.slice(84, 88);
			console.log('Широта: ' + this.bytesToInt(lat) / 100000);
			// Довгота
			const long = bbiFile.slice(88, 92);
			console.log('Довгота: ' + this.bytesToInt(long) / 100000);
			*/

			// Сертифікат
			const num5 = this.bytesToInt(bbiFile.slice(120, 124));
			if (num5 === 0) {
				protocol.protocolStatus = (true);
				protocol.status = 'Разблокирован';
			} else {
				protocol.protocolStatus = (false);
				protocol.status = 'Заблокирован';
			}

			// Тести
			let num2 = 0;
			let b2;
			// Перевіряємо, скільки тестів міститься в файлі
			let sourceIndex = 312;
			while (sourceIndex < 1792) {
				b2 = bbiFile.slice(sourceIndex, sourceIndex + 4);
				if (this.bytesToInt(b2) !== 0) {
					++num2;
					sourceIndex += 256;
				} else {
					break;
				}
			}

			// impuls / litr
			let num3 = this.bytesToInt(bbiFile.slice(92, 96));
			if (num3 === 0) {
				num3 = 10000;
			}

			const testId = new Array;
			// Заповнення масиву з тестами
			for (let index = 0; index < num2; index++) {
				console.log(fileName);
				const test: Test = {
					bbiFileName: fileName,
					name: '',
					installedExes: 0,
					assumedFault: 0,
					etalonCapacity: 0,
					initValue: 0,
					finalValue: 0,
					counterCapacity: 0,
					testDuration: 0,
					mediumExes: 0,
					isInZone: '',
					calculatedFault: 0,
					result: '',
					startStateImage: null,
					endStateImage: null
				};

				// index + 1 << 8
				const ind = (index + 1 << 8);

				// Заданный расход, м3/ч
				b2 = bbiFile.slice(ind, ind + 4);
				test.installedExes = (this.bytesToInt(b2) * 3.59999990463257 / num3);

				// Допустимая погрешность
				b2 = bbiFile.slice(ind + 12, ind + 16);
				test.assumedFault = (this.bytesToInt(b2) / 10);

				// Объем эталона
				b2 = bbiFile.slice(ind + 16, ind + 20);
				test.etalonCapacity = (this.bytesToInt(b2) / num3);

				// Начальное значение in Value
				b2 = bbiFile.slice(ind + 40, ind + 44);
				test.initValue = (this.bytesToInt(b2) / 10000);

				// Начальное значение, л
				const startv = (this.bytesToInt(b2) / 10000);

				// Конечное значение, л
				b2 = bbiFile.slice(ind + 44, ind + 48);
				test.finalValue = (this.bytesToInt(b2) / 10000);

				// Конечное значение in Value
				const endv = (this.bytesToInt(b2) / 10000);

				// Объем по счётчику, л
				test.counterCapacity = (endv - startv);

				// Продолжительность теста, с	
				b2 = bbiFile.slice(ind + 56, ind + 60);
				test.testDuration = (this.bytesToInt(b2) / 1000);

				// Средний расход, м3/ч	
				b2 = bbiFile.slice(ind + 64, ind + 68);
				test.mediumExes = (this.bytesToInt(b2) / 1000);

				// Визначення за формулою, чи входить в зону показ лічильника
				// num7 num8 result1 result2
				const result1 = (this.bytesToInt(b2) / 1000);
				const result2 = (this.bytesToInt(b2) * 3.59999990463257 / num3);
				b2 = bbiFile.slice(ind + 4, ind + 8);
				const num7 = this.bytesToInt(b2);
				b2 = bbiFile.slice(ind + 8, ind + 12);
				const num8 = this.bytesToInt(b2);

				if ((result2 - result2 * num7 / 100.0 <= result1) && (result2 + result2 * num8 / 100.0 >= result1)) {
					test.isInZone = 'Не в зоні';
				} else {
					test.isInZone = 'В зоні';
				}
				// Обробка поля результатів тесту
				if (test.initValue !== 0 && test.finalValue !== 0) {
					const differ = test.counterCapacity - test.etalonCapacity;
					test.calculatedFault = (differ * 100 / test.etalonCapacity);
				} else {
					test.calculatedFault = 0;
				}

				// Перевірка за Начальное значение і Конечное значение
				const result1finalValue = test.finalValue;
				const result2initValue = test.initValue;

				if (result1finalValue === 0.0) {
					if (result1finalValue === 0.0 && result2initValue === 0.0) {
						test.result = 'Не обработан';
					} else if (result2initValue > result1finalValue) {
						test.result = 'Не обработан';
					} else if (result2initValue === result1finalValue) {
						test.result = 'Не годен';
					}
				} else {
					const result1calculatedFault = test.calculatedFault;
					const result2assumedFault = test.assumedFault;

					if (result2assumedFault >= Math.abs(result1calculatedFault)) {
						test.result = 'Годен';
					} else {
						test.result = 'Не годен';
					}
				}

				let testIdCount = 0.0;

				testId[index] = (bbiFile[(index + 1 << 8) + 72]);
				// Підрахунок кількості тестів
				if ((testId[index] % 10.0) === 0) {
					++testIdCount;
				}

				//  GetImage(bbiFile, 0).Save(@"C:\file\image0.jpeg", ImageFormat.Jpeg);
				test.startStateImage = this.bytesToImage(bbiFile, index * 2 + 1).toString();
				test.endStateImage = this.bytesToImage(bbiFile, index * 2 + 2).toString();

				// Протокол "Не обработан" чи "Годен" чи "Не Годен"
				if (test.result === 'Не обработан') {
					protocol.result = 'Не обработан';
				} else if (test.result === 'Годен') {
					protocol.result = 'Годен';
				} else if (test.result === 'Не годен') {
					protocol.result = 'Не годен';
				}

				// Протокол "В зоні" чи "Не в зоні"
				if (test.isInZone === 'В зоне') {
					protocol.status = 'В зоне';
				} else if (test.isInZone === 'Не в зоне') {
					protocol.status = 'Не в зоне';
				}

				// Встановлення імені тесту
				const testNameNumber = Math.round(testId[index] / 10);
				const testNameSubNumber = Math.round(testId[index] % 10);

				if (testNameSubNumber === 0) {
					test.name = 'Тест ' + testNameNumber;
				} else {
					test.name = 'Тест ' + testNameNumber + ' Повтор ' + testNameSubNumber;
				}

				// Додавання протоколу
				protocol.tests.push(test);
			}
			
			// this.http.post<any>(url, protocol)
			// .subscribe(() => {
			// 	console.log('Success');
			// });
		};

		files.forEach(file => {
			fileName = file.name;
			reader.readAsArrayBuffer(file);
		});
	}

	uintToString(bytes: Uint8Array): String {
		const encodedString = String.fromCharCode.apply(null, bytes),
			decodedString = decodeURIComponent(escape(encodedString));
		return decodedString;
	}

	bytesToInt(bytes: Uint8Array): number {
		const startbyte = bytes.byteOffset + bytes.byteLength - Uint32Array.BYTES_PER_ELEMENT;
		const u32bytes = bytes.buffer.slice(startbyte, startbyte + Uint32Array.BYTES_PER_ELEMENT);
		return new Uint32Array(u32bytes)[0];
	}

	bytesToImage(bbiFile: Uint8Array, id: Number): Uint8Array {
		let imgNum = 0;
		let imgLength = 0;

		switch (id) {
			case 0:
				imgNum = 4098;
				imgLength = (bbiFile[4098] & 255) << 8 | bbiFile[4099] & 255;
				break;
			case 1:
				imgNum = 20482;
				imgLength = (bbiFile[20482] & 255) << 8 | bbiFile[20483] & 255;
				break;
			case 2:
				imgNum = 36866;
				imgLength = (bbiFile[36866] & 255) << 8 | bbiFile[36867] & 255;
				break;
			case 3:
				imgNum = 53250;
				imgLength = (bbiFile[53250] & 255) << 8 | bbiFile[53251] & 255;
				break;
			case 4:
				imgNum = 69634;
				imgLength = (bbiFile[69634] & 255) << 8 | bbiFile[69635] & 255;
				break;
			case 5:
				imgNum = 86018;
				imgLength = (bbiFile[86018] & 255) << 8 | bbiFile[86019] & 255;
				break;
			case 6:
				imgNum = 102402;
				imgLength = (bbiFile[102402] & 255) << 8 | bbiFile[102403] & 255;
				break;
			case 7:
				imgNum = 118786;
				imgLength = (bbiFile[118786] & 255) << 8 | bbiFile[118787] & 255;
				break;
			case 8:
				imgNum = 135170;
				imgLength = (bbiFile[135170] & 255) << 8 | bbiFile[135171] & 255;
				break;
			case 9:
				imgNum = 151554;
				imgLength = (bbiFile[151554] & 255) << 8 | bbiFile[151555] & 255;
				break;
			case 10:
				imgNum = 167938;
				imgLength = (bbiFile[167938] & 255) << 8 | bbiFile[167939] & 255;
				break;
			case 11:
				imgNum = 184322;
				imgLength = (bbiFile[184322] & 255) << 8 | bbiFile[184323] & 255;
				break;
			case 12:
				imgNum = 200706;
				imgLength = (bbiFile[200706] & 255) << 8 | bbiFile[200707] & 255;
				break;

			default:
				break;

		}
		const imageBytes = bbiFile.slice(imgNum + 2, imgNum + 2 + imgLength);
		const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(imageBytes)));

		if (base64String !== '') {
			return imageBytes;
		}
		return imageBytes;
	}
}

import { Injectable } from '@angular/core';
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

		reader.onload = () => {
			const protocol: Protocol;
			// console.log(reader.result);
			const byteArray = <ArrayBuffer>reader.result;
			const bbiFile = new Uint8Array(byteArray);
			// Дата
			protocol.day = bbiFile[0];
			protocol.month = bbiFile[1];
			protocol.year = (bbiFile[2] | bbiFile[3] << 8);
			protocol.hours = bbiFile[4];
			protocol.minute = bbiFile[5];

			// Дата
			const date = new Date((bbiFile[2] | bbiFile[3] << 8), bbiFile[1], bbiFile[0], bbiFile[4], bbiFile[5]);
			protocol.date = date;

			// Номер счётчика
			const counter = bbiFile.slice(72, 84);
			protocol.counterNumber = this.uintToString(counter);
			// Температура
			const temp = bbiFile.slice(20, 24);
			protocol.temperature = this.bytesToInt(temp);
			// Накоплений об'єм
			const liter = bbiFile.slice(96, 104);
			protocol.capacity = this.uintToString(liter);
			// Тип лічильника
			const countType = bbiFile.slice(104, 110);
			const countType2 = bbiFile.slice(112, 116);
			protocol.type = this.uintToString(countType) + 'КВ' + this.uintToString(countType2));
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
			} else {
				protocol.protocolStatus = (false);
			}

			// Тести
			let num2 = 0;
			let b2;
			// Перевіряємо, скільки тестів міститься в файлі
			let sourceIndex = 312;
			while (sourceIndex < 1792) {
				b2 = bbiFile.slice(sourceIndex, sourceIndex + 4);
				if (this.bytesToInt(b2) != 0) {
					++num2;
					sourceIndex += 256;
				} else { 
					break; 
				}
			}

			// impuls / litr
			let num3 = this.bytesToInt(bbiFile.slice(92, 96));
			if (num3 == 0) {
				num3 = 10000;
			}

		};

		files.forEach(file => {
			reader.readAsArrayBuffer(file);
		});
	}

	uintToString(bytes: Uint8Array): String {
		const encodedString = String.fromCharCode.apply(null, bytes),
			decodedString = decodeURIComponent(escape(encodedString));
		return decodedString;
	}

	bytesToInt(bytes: Uint8Array): Uint32Array {
		const startbyte = bytes.byteOffset + bytes.byteLength - Uint32Array.BYTES_PER_ELEMENT;
		const u32bytes = bytes.buffer.slice(startbyte, startbyte + Uint32Array.BYTES_PER_ELEMENT);
		return new Uint32Array(u32bytes);
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

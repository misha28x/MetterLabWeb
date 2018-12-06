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
		let counter = 0;
		const reader = new FileReader();

		reader.onload = () =>  {
			const protocol: Protocol;
			console.log(reader.result);
			let byteArray = <ArrayBuffer>reader.result;
			let bbiFile = new Uint8Array(byteArray);
			// Дата
			protocol.day = bbiFile[0];
			console.log('day: ' + bbiFile[0]);
			console.log('month: ' + bbiFile[1]);
			console.log('year: ' + (bbiFile[2] | bbiFile[3] << 8));
			console.log('hours: ' + bbiFile[4]);
			console.log('minute: ' + bbiFile[5]);
		}

		files.forEach( file => {
			
			reader.readAsArrayBuffer(file);		
		});
	}

	bytesToInt(bytes): Uint32Array {
		var startbyte = bytes.byteOffset + bytes.byteLength - Uint32Array.BYTES_PER_ELEMENT;
		var u32bytes = bytes.buffer.slice(startbyte, startbyte + Uint32Array.BYTES_PER_ELEMENT);
		return new Uint32Array(u32bytes);
	}

	bytesToImage(bbiFile, id): ImageBitmap {
		var imgNum = 0;
		var imgLength = 0;

		switch (id) {
			case 0:
				imgNum = 4098
				imgLength = (bbiFile[4098] & 255) << 8 | bbiFile[4099] & 255;
				break;
			case 1:
				imgNum = 20482
				imgLength = (bbiFile[20482] & 255) << 8 | bbiFile[20483] & 255;
				break;
			case 2:
				imgNum = 36866
				imgLength = (bbiFile[36866] & 255) << 8 | bbiFile[36867] & 255;
				break;
			case 3:
				imgNum = 53250
				imgLength = (bbiFile[53250] & 255) << 8 | bbiFile[53251] & 255;
				break;
			case 4:
				imgNum = 69634
				imgLength = (bbiFile[69634] & 255) << 8 | bbiFile[69635] & 255;
				break;
			case 5:
				imgNum = 86018
				imgLength = (bbiFile[86018] & 255) << 8 | bbiFile[86019] & 255;
				break;
			case 6:
				imgNum = 102402
				imgLength = (bbiFile[102402] & 255) << 8 | bbiFile[102403] & 255;
				break;
			case 7:
				imgNum = 118786
				imgLength = (bbiFile[118786] & 255) << 8 | bbiFile[118787] & 255;
				break;
			case 8:
				imgNum = 135170
				imgLength = (bbiFile[135170] & 255) << 8 | bbiFile[135171] & 255;
				break;
			case 9:
				imgNum = 151554
				imgLength = (bbiFile[151554] & 255) << 8 | bbiFile[151555] & 255;
				break;
			case 10:
				imgNum = 167938
				imgLength = (bbiFile[167938] & 255) << 8 | bbiFile[167939] & 255;
				break;
			case 11:
				imgNum = 184322
				imgLength = (bbiFile[184322] & 255) << 8 | bbiFile[184323] & 255;
				break;
			case 12:
				imgNum = 200706
				imgLength = (bbiFile[200706] & 255) << 8 | bbiFile[200707] & 255;
				break;

			default:
				break;

			return new ImageBitmap();
		}

}

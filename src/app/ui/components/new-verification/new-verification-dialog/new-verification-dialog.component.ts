import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { DataService } from '../../../../services/data.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
  selector: 'app-new-verification-dialog',
  templateUrl: './new-verification-dialog.component.html',
  styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit {
	step: number;
  private url: string;
  constructor(
    private dialogRef: MatDialogRef<NewVerificationDialogComponent>,
    private dataSv: DataService
    ) { }

	setStep(index: number): void {
		this.step = index;
	}

	nextStep(): void {
		this.step++;
	}

	prevStep(): void {
		this.step--;
	}

  send(): void {
    const testObj = {
      number: 12345,
      client: 'Vitalya',
      data: new Date()
    };

    this.dataSv.sendData(url, testObj).subscribe(() => {
      console.log('data sended');
    });
  }

  ngOnInit(): void { }
}

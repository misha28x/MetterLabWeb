import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-verification-dialog',
  templateUrl: './new-verification-dialog.component.html',
  styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit {
	step: number;

  constructor(private dialogRef: MatDialogRef<NewVerificationDialogComponent>) { }

	setStep(index: number): void {
		this.step = index;
	}

	nextStep(): void {
		this.step++;
	}

	prevStep(): void {
		this.step--;
	}

  ngOnInit(): void { }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Protocol } from '../../../../interfaces/protocol';
import { PhotoOrientationService } from '../../../../services/photo-orientation.service';

@Component({
  selector: 'app-counter-dialog-data',
  templateUrl: './counter-dialog-data.component.html',
  styleUrls: ['./counter-dialog-data.component.scss']
})
export class CounterDialogDataComponent implements OnInit {

  counterFormGroup: FormGroup;
  angle: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Protocol,
    private dialogRef: MatDialogRef<CounterDialogDataComponent>,
    private photoSv: PhotoOrientationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void { 
    this.counterFormGroup = this.fb.group({
      counterNumber: this.data.counterNumber,
      acumulatedVolume: this.data.acumulatedVolume,
      symbol: this.data.symbol,
      serviceType: this.data.serviceType,
      type: this.data.type,
      productionYear: this.data.productionYear
    });

    this.angle = this.photoSv.getAngle();  
  }
  
  saveProtocol(): void {
    this.data.counterNumber = this.counterFormGroup.get('counterNumber').value;
    this.data.acumulatedVolume = this.counterFormGroup.get('acumulatedVolume').value;
    this.data.symbol = this.counterFormGroup.get('symbol').value;
    this.data.serviceType = this.counterFormGroup.get('serviceType').value;
    this.data.type = this.counterFormGroup.get('type').value;
    this.data.productionYear = this.counterFormGroup.get('productionYear').value;

    this.dialogRef.close();
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.image.toString();
  }
}

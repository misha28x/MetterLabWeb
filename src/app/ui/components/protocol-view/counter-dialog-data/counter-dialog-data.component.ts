import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Protocol } from '../../../../interfaces/protocol';
import { PhotoOrientationService } from '../../../../services/photo-orientation.service';
import { ManufacturersService } from '../../../../services/manufactors.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-counter-dialog-data',
  templateUrl: './counter-dialog-data.component.html',
  styleUrls: ['./counter-dialog-data.component.scss']
})
export class CounterDialogDataComponent implements OnInit {
  counterFormGroup: FormGroup;
  filteredManufacturers: Observable<string[]>;
  angle: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Protocol,
    private dialogRef: MatDialogRef<CounterDialogDataComponent>,
    private photoSv: PhotoOrientationService,
    private manuService: ManufacturersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.counterFormGroup = this.fb.group({
      counterNumber: this.data.counterNumber,
      acumulatedVolume: this.data.acumulatedVolume,
      symbol: this.data.symbol,
      serviceType: this.data.serviceType,
      type: this.data.type,
      productionYear: this.data.productionYear,
      manufacturer: this.data.manufacturer
    });

    this.filteredManufacturers = combineLatest(
      this.manuService.getManufacturers(),
      this.counterFormGroup.get('manufacturer').valueChanges
    ).pipe(
      map(([manufacturers, val]) =>
        manufacturers
          .filter(manufacturer => manufacturer.manufacturer.indexOf(val) > -1)
          .map(manufacturer => manufacturer.manufacturer)
      )
    );

    this.angle = this.photoSv.getAngle();
  }

  saveProtocol(): void {
    const counterData = this.counterFormGroup.value;
    this.dialogRef.close(counterData);
  }

  getImgSource(): string {
    return 'data:image/png;base64,' + this.data.image.toString();
  }
}

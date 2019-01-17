import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Verification } from '../../../../interfaces/verifications';
import { DataService } from '../../../../services/data.service';

const url = 'http://localhost:3000/api/new-verifications';

@Component({
  selector: 'app-detail-view-dialog',
  templateUrl: './detail-view-dialog.component.html',
  styleUrls: ['./detail-view-dialog.component.scss']
})
export class DetailViewDialogComponent implements OnInit {

  verification: Verification;

  generalDataForm: FormGroup;
  locationForm: FormGroup;
  counterForm: FormGroup;
  additionalDataForm: FormGroup;

  private url: string;

  constructor(
    private dataSv: DataService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DetailViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const surname = this.data.verification.client.split('')[0];
    const name = this.data.verification.client.split('')[1];
    const middlename = this.data.verification.client.split('')[2];

    this.generalDataForm = this.fb.group({
      surname: surname,
      name: name,
      middlename: middlename,
      phone: this.data.verification.phoneNumber
    });

    this.locationForm = this.fb.group({
      region: this.data.verification.region,
      district: this.data.verification.district,
      settlement: this.data.verification.settlement,
      index: this.data.verification.index,
      street: this.data.verification.street,
      house: this.data.verification.house,
      apartment: this.data.verification.apartment,
      isDismantled: false,
      isUnique: false,
      counterQuantity: this.data.verification.counterQuantity,
      serviceType: this.data.verification.serviceType,
      serviceProvider: this.data.verification.serviceProvider
    });

    this.counterForm = this.fb.group({
      isDismantled: false,
      montageDate: this.data.verification.montageDate,
      employeeName: this.data.verification.employeeName,
      comment: this.data.verification.comment,
      counterNumber: this.data.verification.counterNumber,
      haveSeal: this.data.verification.haveSeal,
      counterType: this.data.verification.counterType,
      productionYear: this.data.verification.productionYear,
      symbol: this.data.verification.symbol,
      acumulatedVolume: this.data.verification.acumulatedVolume
    });

    this.additionalDataForm = this.fb.group({
      entrance: '',
      doorCode: '',
      floor: '',
      favorDate: '',
      sanitaryWellFare: '',
      waterAbsentTo: '',
      note: this.data.verification.note
    });
  }

  sendData(): void {
    this.data.verificationSv.sendData(url, this.setVerification());
  }
  setVerification(): Verification {
    const name = this.generalDataForm.get('name').value.replace(/'/g, /\'/);
    const surname = this.generalDataForm.get('surname').value.replace(/'/g, /\'/);
    const middlename = this.generalDataForm.get('middlename').value.replace(/'/g, /\'/);

    const fullName = `${surname} ${name} ${middlename}`;

    return {
      client: fullName,
      phoneNumber: this.generalDataForm.get('phone').value,
      addingDate: new Date().getUTCDate() + '-' + new Date().getUTCMonth() + 1 + '-' + new Date().getUTCFullYear(),
      region: this.locationForm.get('region').value.replace(/'/g, /\'/),
      district: this.locationForm.get('district').value.replace(/'/g, /\'/),
      settlement: this.locationForm.get('settlement').value.replace(/'/g, /\'/),
      index: this.locationForm.get('index').value,
      street: this.locationForm.get('street').value,
      house: this.locationForm.get('house').value,
      apartment: this.locationForm.get('apartment').value,
      isDismantled: this.locationForm.get('isDismantled').value,
      montageDate: this.counterForm.get('montageDate').value,
      employeeName: this.counterForm.get('employeeName').value.replace(/'/g, /\'/),
      comment: this.counterForm.get('comment').value.replace(/'/g, /\'/),
      counterNumber: this.counterForm.get('counterNumber').value,
      haveSeal: this.counterForm.get('haveSeal').value,
      counterType: this.counterForm.get('counterType').value,
      productionYear: this.counterForm.get('productionYear').value,
      acumulatedVolume: this.counterForm.get('acumulatedVolume').value,
      favorDate: this.additionalDataForm.get('favorDate').value,
      sanitaryWellfare: this.additionalDataForm.get('sanitaryWellFare').value,
      waterAbsentTo: this.additionalDataForm.get('waterAbsentTo').value,
      note: this.additionalDataForm.get('note').value,
      serviceProvider: this.locationForm.get('serviceProvider').value,
      serviceType: this.locationForm.get('serviceType').value,
      symbol: this.counterForm.get('symbol').value,
      counterQuantity: this.locationForm.get('counterQuantity').value,
      floor: this.additionalDataForm.get('floor').value,
      entrance: this.additionalDataForm.get('entrance').value
    };
  }
}

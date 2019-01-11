import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Verification } from '../../../../interfaces/verifications';
import { DataService } from '../../../../services/data.service';
import { VerificationService } from '../../../../services/verification.service';

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
    private verificationSv: VerificationService,
    private dataSv: DataService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Verification
  ) { }

  ngOnInit(): void {
    const surname = this.data.client.split('')[0];
    const name = this.data.client.split('')[1];
    const middlename = this.data.client.split('')[2];

    this.generalDataForm = this.fb.group({
      surname: surname,
      name: name,
      middlename: middlename,
      phone: this.data.phoneNumber
    });

    this.locationForm = this.fb.group({
      region: this.data.region,
      district: this.data.district,
      settlement: this.data.settlement,
      index: this.data.index,
      street: this.data.street,
      house: this.data.house,
      apartment: this.data.apartment,
      isDismantled: false,
      isUnique: false,
      counterQuantity: this.data.counterQuantity,
      serviceType: this.data.serviceType,
      serviceProvider: this.data.serviceProvider
    });

    this.counterForm = this.fb.group({
      isDismantled: false,
      montageDate: this.data.montageDate,
      employeeName: this.data.employeeName,
      comment: this.data.comment,
      counterNumber: this.data.counterNumber,
      haveSeal: this.data.haveSeal,
      counterType: this.data.counterType,
      productionYear: this.data.productionYear,
      symbol: this.data.symbol,
      acumulatedVolume: this.data.acumulatedVolume
    });

    this.additionalDataForm = this.fb.group({
      entrance: '',
      doorCode: '',
      floor: '',
      favorDate: '',
      sanitaryWellFare: '',
      waterAbsentTo: '',
      note: this.data.note
    });
  }

  sendData(): void {
    this.dataSv.sendData(url, this.setVerification());
  }
  
  setVerification(): Verification {
    const name = this.generalDataForm.get('name').value.replace(/'/g, /\'/);
    const surname = this.generalDataForm.get('surname').value.replace(/'/g, /\'/);
    const middlename = this.generalDataForm.get('middlename').value.replace(/'/g, /\'/);

    const fullName = `${surname} ${name} ${middlename}`;

    return {
      client: fullName,
      phoneNumber: this.generalDataForm.get('phone').value,
      addingDate: new Date().getUTCDate() + '-' + new Date().getUTCMonth() + '-' + new Date().getUTCFullYear(),
      district: this.locationForm.get('district').value.replace(/'/g, /\'/),
      settlement: this.locationForm.get('district').value.replace(/'/g, /\'/),
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
      applicationNumber: '',
      brigadeName: '',
      note: this.additionalDataForm.get('note').value.replace(/'/g, /\'/),
      serviceProvider: this.locationForm.get('serviceProvider').value.replace(/'/g, /\'/),
      serviceType: this.locationForm.get('serviceType').value,
      stationNumber: '',
      status: '',
      symbol: this.counterForm.get('symbol').value,
      taskDate: ''
    };
  }
}

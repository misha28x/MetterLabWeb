import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';

import { VerificationService } from '../../../../services/verification.service';
import { Verification } from '../../../../interfaces/verifications';
import { SourceService } from '../../../../services/source.service';
import { DataService } from '../../../../services/data.service';

const employeeUrl = 'http://localhost:3000/api/new-verifications/employee';
const typeUrl = 'http://localhost:3000/api/new-verifications/device';
const symbolUrl = 'http://localhost:3000/api/new-verifications/dn';

@Component({
  selector: 'app-detail-view-dialog',
  templateUrl: './detail-view-dialog.component.html',
  styleUrls: ['./detail-view-dialog.component.scss']
})
export class DetailViewDialogComponent implements OnInit {

  verification: Verification;
  additionalData: any;
  generalDataForm: FormGroup;
  locationForm: FormGroup;
  counterForm: FormGroup;
  additionalDataForm: FormGroup;

  permission: number;

  private url: string;

  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<number>,
    private sourceSv: SourceService,
    private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<DetailViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(perm => this.permission = perm) ;

    const $employeeObservable = this.dataSv.getData(employeeUrl);
    const $symbolObservable = this.dataSv.getData(symbolUrl);
    const $typeObservable = this.dataSv.getData(typeUrl);

    const dataObservable = concat($employeeObservable, $symbolObservable, $typeObservable);

    this.additionalData = {};
    dataObservable.subscribe((next: [any]) => {
      const key = Object.keys(next[0])[0];

      this.additionalData[key] = next.map(val => {
        return val[key];
      });
    });

    const nameArr = this.data.verification[0].client.split(' ');
    const surname = nameArr[0];
    const name = nameArr[1];
    const middlename = nameArr[2];

    this.generalDataForm = this.fb.group({
      surname: surname,
      name: name,
      middlename: middlename,
      phone: this.data.verification[0].phoneNumber,
      mail: this.data.verification[0].mail || '',
      ipn: this.data.verification[0].ipn || ''
    });

    this.locationForm = this.fb.group({
      region: this.data.verification[0].region,
      district: this.data.verification[0].district,
      settlement: this.data.verification[0].settlement,
      index: this.data.verification[0].index,
      street: this.data.verification[0].street,
      house: this.data.verification[0].house,
      apartment: this.data.verification[0].apartment,
      isDismantled: false,
      isUnique: false,
      counterQuantity: this.data.verification[0].counterQuantity,
      serviceType: this.data.verification[0].serviceType,
      serviceProvider: this.data.verification[0].serviceProvider,
      comment: this.data.verification[0].comment
    });

    this.counterForm = this.fb.group({
      isDismantled: false,
      montageDate: new Date(this.data.verification[0].montageDate) || null,
      employeeName: this.data.verification[0].employeeName,
      counterNumber: this.data.verification[0].counterNumber,
      haveSeal: this.data.verification[0].haveSeal,
      counterType: this.data.verification[0].counterType,
      productionYear: this.data.verification[0].productionYear,
      symbol: this.data.verification[0].symbol,
      acumulatedVolume: this.data.verification[0].acumulatedVolume
    });

    const date = new Date();
    date.setMinutes(0);
    date.setHours(0);

    this.additionalDataForm = this.fb.group({
      entrance: this.data.verification[0].entrance,
      doorCode: this.data.verification[0].doorCode,
      floor: this.data.verification[0].floor,
      favorDate: new Date(this.data.verification[0].favorDate),
      favorTime: new Date(this.data.verification[0].favorTime || date),
      sanitaryWellFare: this.data.verification[0].sanitaryWellFare,
      waterAbsentTo: this.data.verification[0].waterAbsentTo,
      note: this.data.verification[0].note
    });
  }

  sendData(): void {
    this.verificationSv
      .updateVerification(this.data.verification[0].applicationNumber, this.setVerification()).subscribe(
        () => {
          this.sourceSv.fetchNewVerifications();
          this.sourceSv.fetchTaskPlaning();
          this.sourceSv.fetchLabRequest();
        }
      );

    this.dialogRef.close();
  }

  checkForDupliacates(): void {
    this.verificationSv.addVerification(this.setVerification());
  }

  setVerification(): Verification {
    const name = this.generalDataForm.get('name').value.replace(/'/g, /\'/);
    const surname = this.generalDataForm.get('surname').value.replace(/'/g, /\'/);
    const middlename = this.generalDataForm.get('middlename').value.replace(/'/g, /\'/);

    const fullName = `${surname} ${name} ${middlename}`;

    return {
      client: fullName,
      phoneNumber: this.generalDataForm.get('phone').value,
      addingDate: new Date().getUTCFullYear() + '-' + new Date().getUTCMonth() + 1 + '-' + new Date().getUTCDate(),
      region: this.locationForm.get('region').value.replace(/'/g, /\'/),
      district: this.locationForm.get('district').value.replace(/'/g, /\'/),
      settlement: this.locationForm.get('settlement').value.replace(/'/g, /\'/),
      index: this.locationForm.get('index').value,
      street: this.locationForm.get('street').value,
      house: this.locationForm.get('house').value,
      apartment: this.locationForm.get('apartment').value,
      isDismantled: this.locationForm.get('isDismantled').value,
      montageDate: this.counterForm.get('montageDate').value
        ? this.counterForm.get('montageDate').value.toISOString() : '',
      employeeName: this.counterForm.get('employeeName').value.replace(/'/g, /\'/),
      comment: this.counterForm.get('comment').value.replace(/'/g, /\'/),
      counterNumber: this.counterForm.get('counterNumber').value,
      haveSeal: this.counterForm.get('haveSeal').value,
      counterType: this.counterForm.get('counterType').value,
      productionYear: this.counterForm.get('productionYear').value,
      acumulatedVolume: this.counterForm.get('acumulatedVolume').value,
      favorDate: this.additionalDataForm.get('favorDate').value
        ? this.additionalDataForm.get('favorDate').value.toISOString()
        : '',
      favorTime: this.additionalDataForm.get('favorTime').value.toString(),
      sanitaryWellfare: this.additionalDataForm.get('sanitaryWellFare').value,
      waterAbsentTo: this.additionalDataForm.get('waterAbsentTo').value
        ? this.additionalDataForm.get('waterAbsentTo').value.toISOString() : '',
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

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { concat, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { VerificationService } from '../../../services/verification.service';
import { Verification } from '../../../interfaces/verifications';
import { SourceService } from '../../../services/source.service';
import { DataService } from '../../../services/data.service';

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

  addresses$: Observable<any>;
  cities: string[];
  streets: string[];
  districts: string[];

  filteredDistricts: Observable<string[]>;
  filteredSettlement: Observable<string[]>;
  filteredStreets: Observable<string[]>;
  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<number>,
    private sourceSv: SourceService,
    private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<DetailViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(user => (this.permission = user.permission));

    const $symbolObservable = this.dataSv.getData(symbolUrl);
    const $typeObservable = this.dataSv.getData(typeUrl);

    const dataObservable = concat($symbolObservable, $typeObservable);

    this.additionalData = {};

    dataObservable.subscribe((next: any[]) => {
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
      phoneNumber: this.data.verification[0].phoneNumber,
      additionalPhone: this.data.verification[0].additionalPhone,
      mail: this.data.verification[0].mail || '',
      ipn: this.data.verification[0].ipn || ''
    });

    this.locationForm = this.fb.group({
      region: 'Волинська',
      district: this.data.verification[0].district,
      settlement: this.data.verification[0].settlement,
      street: this.data.verification[0].street,
      house: this.data.verification[0].house,
      apartment: this.data.verification[0].apartment,
      isUnique: this.data.verification[0].isUnique,
      counterQuantity: this.data.verification[0].counterQuantity,
      serviceType: this.data.verification[0].serviceType,
      serviceProvider: this.data.verification[0].serviceProvider
    });

    this.counterForm = this.fb.group({
      counterNumber: this.data.verification[0].counterNumber,
      haveSeal: this.data.verification[0].haveSeal === 1,
      counterType: this.data.verification[0].counterType,
      productionYear: this.data.verification[0].productionYear,
      symbol: this.data.verification[0].symbol,
      acumulatedVolume: this.data.verification[0].acumulatedVolume
    });

    const date = new Date();
    date.setMinutes(0);
    date.setHours(0);

    const time = this.data.verification[0].favorTime
      ? this.data.verification[0].favorTime.split(':')
      : [0, 0];
    const favorTime = new Date();
    favorTime.setHours(time[0]);
    favorTime.setMinutes(time[1]);

    this.additionalDataForm = this.fb.group({
      favorTime: favorTime,
      note: this.data.verification[0].note,
      comment: this.data.verification[0].comment
    });

    this.getAddress();
  }

  getAddress(): any {
    this.data.address.subscribe(res => {
      this.cities = Array.from(new Set(res.map(address => address.city)));
      this.streets = Array.from(new Set(res.map(address => address.street)));
      this.districts = Array.from(new Set(res.map(address => address.district)));
    });

    this.filteredDistricts = this.locationForm.get('district').valueChanges.pipe(
      startWith(''),
      map(_res => this.districts.filter(district => district.toLowerCase().includes(_res.toLowerCase())))
    );

    this.filteredSettlement = this.locationForm.get('settlement').valueChanges.pipe(
      startWith(''),
      map(_res => this.cities.filter(city => city.toLowerCase().includes(_res.toLowerCase())))
    );

    this.filteredStreets = this.locationForm.get('street').valueChanges.pipe(
      startWith(''),
      map(_res => this.streets.filter(street => street.toLowerCase().includes(_res.toLowerCase())))
    );
  }

  sendData(): void {
    this.verificationSv
      .updateVerification(this.data.verification[0].applicationNumber, this.setVerification())
      .subscribe(() => {
        this.sourceSv.fetchNewVerifications();
        this.sourceSv.fetchTaskPlaning();
        this.sourceSv.fetchLabRequest();
        this.dialogRef.close();
      });
  }

  checkForDupliacates(): void {
    this.verificationSv.addVerification(this.setVerification());
  }

  setVerification(): Verification {
    const name = this.generalDataForm.get('name').value.replace("'", '`');
    const surname = this.generalDataForm.get('surname').value.replace("'", '`');

    const middlename = this.generalDataForm.get('middlename').value.replace("'", '`');

    const fullName = `${surname} ${name} ${middlename}`;
    const time = new Date(this.additionalDataForm.get('favorTime').value);

    const haveSeal = this.counterForm.get('haveSeal').value ? 1 : 0;
    return {
      ...this.generalDataForm.value,
      ...this.locationForm.value,
      ...this.counterForm.value,
      ...this.additionalDataForm.value,
      client: fullName,
      haveSeal: haveSeal,
      favorTime: [time.getHours(), time.getMinutes()]
    };
  }
}

import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from 'src/app/services/data.service';
import { Verification } from 'src/app/interfaces/verifications';
import { VerificationService } from 'src/app/services/verification.service';

import { User } from '../../../../interfaces/user';

const url = 'http://165.22.83.21:3000/api/new-verifications';

@Component({
  selector: 'app-new-verification-dialog',
  templateUrl: './new-verification-dialog.component.html',
  styleUrls: ['./new-verification-dialog.component.scss']
})
export class NewVerificationDialogComponent implements OnInit, AfterContentInit {
  step: number;
  verification: Verification;

  generalDataForm: FormGroup;
  locationForm: FormGroup;
  counterForm: FormGroup;
  additionalDataForm: FormGroup;
  showForm: boolean;

  permission: number;
  user: User;

  cities: string[];
  streets: string[];
  districts: string[];

  filteredDistricts: Observable<string[]>;
  filteredSettlement: Observable<string[]>;
  filteredStreets: Observable<string[]>;
  filteredTypes: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<User>,
    private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<NewVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  ngAfterContentInit(): void {
    setTimeout(() => (this.showForm = true), 150);
  }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
      this.permission = _user.permission;
    });

    this.generalDataForm = this.fb.group({
      surname: '',
      name: '',
      middlename: '',
      phoneNumber: '',
      ipn: ''
    });

    this.locationForm = this.fb.group({
      region: '',
      district: '',
      settlement: '',
      street: '',
      house: '',
      apartment: '',
      isUnique: false,
      counterQuantity: 0,
      serviceType: '',
      serviceProvider: '',
      comment: ''
    });

    this.counterForm = this.fb.group({
      counterNumber: '',
      haveSeal: '',
      counterType: '',
      productionYear: '',
      symbol: '',
      acumulatedVolume: ''
    });

    this.additionalDataForm = this.fb.group({
      favorTime: '',
      sanitaryWellFare: '',
      waterAbsentTo: '',
      note: ''
    });

    this.getAddress();
    this.getTypes();
  }

  getTypes(): any {
    this.data.types.pipe().subscribe(_types => {});
  }

  getAddress(): any {
    this.data.address.subscribe(res => {
      this.cities = Array.from(new Set(res.map(address => address.city)));
      this.streets = Array.from(new Set(res.map(address => address.street)));
      this.districts = Array.from(new Set(res.map(address => address.district)));

      this.filteredDistricts = this.locationForm.get('district').valueChanges.pipe(
        startWith(''),
        map(_res =>
          this.districts.filter(district => district.toLowerCase().includes(_res.toLowerCase()))
        )
      );

      this.filteredSettlement = this.locationForm.get('settlement').valueChanges.pipe(
        startWith(''),
        map(_res => this.cities.filter(city => city.toLowerCase().includes(_res.toLowerCase())))
      );

      this.filteredStreets = this.locationForm.get('street').valueChanges.pipe(
        startWith(''),
        map(_res => this.streets.filter(street => street.toLowerCase().includes(_res.toLowerCase())))
      );
    });
  }

  sendData(): void {
    this.dataSv.sendData(url, this.setVerification()).subscribe();
    this.dialogRef.close();
  }

  clearForm(): void {
    this.additionalDataForm.reset();
    this.generalDataForm.reset();
    this.locationForm.reset();
    this.counterForm.reset();
    this.step = 0;
  }

  saveByPattern(): void {
    this.dataSv.sendData(url, this.setVerification()).subscribe();

    this.step = 0;

    this.locationForm.patchValue({
      counterQuantity: 0,
      serviceType: '',
      serviceProvider: ''
    });
  }

  checkForDupliacates(): void {
    this.verificationSv.addVerification(this.setVerification());
  }

  setVerification(): Verification {
    const name = this.generalDataForm.get('name').value.replace(/'/g, /\'/);
    const surname = this.generalDataForm.get('surname').value.replace(/'/g, /\'/);

    const middlename = this.generalDataForm.get('middlename').value.replace(/'/g, /\'/);

    const fullName = `${surname} ${name} ${middlename}`;
    const time = new Date(this.additionalDataForm.get('favorTime').value);
    const status = this.user.permission > 3 ? '' : 'Визначено відповідальну особу';
    const haveSeal = this.counterForm.get('haveSeal').value ? 1 : 0;
    return {
      ...this.generalDataForm.value,
      ...this.locationForm.value,
      ...this.counterForm.value,
      ...this.additionalDataForm.value,
      client: fullName,
      status,
      haveSeal: haveSeal,
      favorTime: [time.getHours(), time.getMinutes()]
    };
  }
}

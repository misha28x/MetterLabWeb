import { AfterContentInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from 'src/app/services/data.service';
import { Verification } from 'src/app/interfaces/verifications';
import { VerificationService } from 'src/app/services/verification.service';

import { IProvider, IUser, ServiceTypes } from '../../../../interfaces/user';

@Component({
  selector: 'app-new-verification-dialog',
  templateUrl: './new-verification-dialog.component.html',
  styleUrls: ['./new-verification-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewVerificationDialogComponent implements OnInit {
  step: number;
  verification: Verification;

  generalDataForm: FormGroup;
  locationForm: FormGroup;
  counterForm: FormGroup;
  additionalDataForm: FormGroup;
  showForm: boolean;

  permission: number;
  user: IUser;

  cities: string[];
  streets: string[];
  districts: string[];

  filteredDistricts: Observable<string[]>;
  filteredSettlement: Observable<string[]>;
  filteredStreets: Observable<string[]>;

  userProviders: IProvider | IProvider[];
  userServices: ServiceTypes;

  displayedServiceTypes: string[];
  userCity: string;

  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<IUser>,
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

  ngOnInit(): void {
    this.setStep(0);
    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;
      this.permission = _user.permission;
    });

    this.generalDataForm = this.fb.group({
      surname: '',
      name: '',
      middlename: '',
      phoneNumber: '',
      additionalPhone: ''
    });

    this.locationForm = this.fb.group({
      region: 'Волинська',
      district: '',
      settlement: '',
      street: '',
      house: '',
      apartment: '',
      isUnique: false,
      counterQuantity: 1,
      serviceType: '1',
      serviceProvider: ''
    });

    this.counterForm = this.fb.group({
      counterNumber: '',
      haveSeal: '',
      comment: '',
      counterType: '',
      productionYear: '',
      symbol: '',
      acumulatedVolume: ''
    });
    const time = new Date();

    time.setHours(0);
    time.setMinutes(0);

    this.additionalDataForm = this.fb.group({
      favorTime: time,
      comment: '',
      sanitaryWellFare: '',
      waterAbsentTo: '',
      note: ''
    });

    this.getAddress();
    this.getTypes();
  }

  setUpUserData(): void {}

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

  clearForm(): void {
    this.additionalDataForm.reset();
    this.generalDataForm.reset();
    this.locationForm.reset();
    this.counterForm.reset();
    this.step = 0;
  }

  sendData(): void {
    const verification = this.setVerification();
    this.verificationSv.createVerification(verification).subscribe();
    this.dialogRef.close();
  }

  saveByPattern(): void {
    this.verificationSv.createVerification(this.setVerification()).subscribe();

    this.step = 1;

    this.locationForm.patchValue({
      counterQuantity: 1,
      serviceType: '1',
      serviceProvider: ''
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
    const status = this.user.permission > 3 ? '' : 'Визначено відповідальну особу';
    const haveSeal = this.counterForm.get('haveSeal').value ? 1 : 0;

    return {
      ...this.generalDataForm.value,
      ...this.locationForm.value,
      ...this.counterForm.value,
      ...this.additionalDataForm.value,
      client: fullName,
      userId: this.user.serviceProvider,
      status,
      haveSeal: haveSeal,
      favorTime: [time.getHours(), time.getMinutes()]
    };
  }
}

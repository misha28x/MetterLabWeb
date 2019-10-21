import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from '../../../../services/data.service';
import { Verification } from '../../../../interfaces/verifications';
import { ProvidersService } from '../../../../services/providers.service';
import { VerificationService } from '../../../../services/verification.service';

import { IUser, ServiceTypes } from '../../../../interfaces/user';

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

  permission: number;
  user: IUser;

  cities: string[];
  streets: string[];
  districts: string[];

  filteredDistricts: Observable<string[]>;
  filteredSettlement: Observable<string[]>;
  filteredStreets: Observable<string[]>;

  userProviders: any[];
  userServices: ServiceTypes[] = [];

  userDistrict: string;

  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<IUser>,
    private providersSv: ProvidersService,
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
    this.initForms();
    this.getTypes();
    this.setStep(0);

    this.store.pipe(select('permission')).subscribe(_user => {
      this.user = _user;

      this.permission = _user.permission;
      this.setUpUserData(_user);
      this.getAddress(this.userDistrict);
    });
  }

  setUpUserData(user: IUser): void {
    this.userServices =
      user.serviceType === ServiceTypes.Both ? [1, 2] : [user.serviceType];

    this.userProviders =
      user.permission > 4
        ? [this.providersSv.getProvider(user.serviceProvider)]
        : this.providersSv.getProviders();

    this.userDistrict = user.permission > 4 ? user.district : '';
  }

  initForms(): void {
    this.generalDataForm = this.fb.group({
      surname: ['', [Validators.required]],
      name: '',
      middlename: '',
      phoneNumber: ['', [Validators.minLength(8), Validators.required]],
      additionalPhone: ['', [Validators.minLength(8)]]
    });

    this.locationForm = this.fb.group({
      region: 'Волинська',
      district: ['', [Validators.required]],
      settlement: ['', [Validators.required]],
      street: ['', [Validators.required]],
      house: ['', [Validators.required]],
      apartment: '',
      isUnique: false,
      counterQuantity: 1,
      serviceType: 1,
      serviceProvider: ['', [Validators.required]]
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
  }

  initLocationData(): void {
    const serviceType =
      this.userServices.length === 1 ? this.userServices[0] : ServiceTypes.ColdWater;

    const serviceProvider =
      this.userProviders.length === 1 ? this.userProviders[0].id : '';

    const district = this.userDistrict;
    const settlement = this.permission > 5 ? this.cities[0] : '';

    setTimeout(() => {
      this.locationForm.patchValue({
        district,
        settlement,
        serviceType,
        serviceProvider: serviceProvider
      });
    }, 50);
  }

  getTypes(): any {
    this.data.types.pipe().subscribe(_types => {});
  }

  getAddress(allowedDistrict: string): any {
    this.data.address
      .pipe(
        map((res: any) =>
          res.filter(address => address.district.includes(allowedDistrict))
        )
      )
      .subscribe(res => {
        this.cities = Array.from(new Set(res.map(address => address.city)));
        this.streets = Array.from(new Set(res.map(address => address.street)));
        this.districts = Array.from(new Set(res.map(address => address.district)));

        this.initLocationData();

        this.filteredDistricts = this.locationForm.get('district').valueChanges.pipe(
          startWith(''),
          map(_res =>
            this.districts.filter(district =>
              district.toLowerCase().includes(_res.toLowerCase())
            )
          )
        );

        this.filteredSettlement = this.locationForm.get('settlement').valueChanges.pipe(
          startWith(''),
          map(_res =>
            this.cities.filter(city => city.toLowerCase().includes(_res.toLowerCase()))
          )
        );

        this.filteredStreets = this.locationForm.get('street').valueChanges.pipe(
          startWith(''),
          map(_res =>
            this.streets.filter(street =>
              street.toLowerCase().includes(_res.toLowerCase())
            )
          )
        );
      });
  }

  getProviders(providers: any): any {
    return Object.keys(providers).map(providerId => ({
      id: providerId,
      providerName: providers[providerId]
    }));
  }

  clearForm(): void {
    this.additionalDataForm.reset();
    this.generalDataForm.reset();
    this.locationForm.reset();
    this.counterForm.reset();
    this.step = 0;
  }

  sendData(): void {
    const validForm = this.locationForm.valid && this.generalDataForm.valid;

    if (validForm) {
      const verification = this.setVerification();
      this.verificationSv.createVerification(verification).subscribe();
      this.dialogRef.close();
    } else {
      const activeStep = this.generalDataForm.invalid ? 0 : 1;

      [this.generalDataForm, this.locationForm].forEach(form => {
        form.markAsDirty();
        form.markAllAsTouched();
      });

      this.setStep(activeStep);
    }
  }

  saveByPattern(): void {
    this.verificationSv.createVerification(this.setVerification()).subscribe();

    this.step = 1;

    this.locationForm.patchValue({
      counterQuantity: 1,
      serviceType: 1,
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

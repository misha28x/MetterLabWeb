import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataService } from '../../../../services/data.service';
import { VerificationDTO } from '../../../../interfaces/verifications';
import { Provider, ProvidersService } from '../../../../services/providers.service';
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
  verification: VerificationDTO;

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

  userProviders: Provider[];
  displayedProviders: Provider[];
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
      this.setUserData(_user);
      this.getAddress(this.userDistrict);
    });
  }

  setUserData(user: IUser): void {
    this.userServices =
      user.serviceType === ServiceTypes.Both ? [1, 2] : [user.serviceType];

    this.userProviders =
      user.permission > 4
        ? this.providersSv.getProvider(user.serviceProvider)
        : this.providersSv.providers;

    this.userDistrict = user.permission > 4 ? user.district : '';
  }

  initLocationData(): void {
    const district = this.userDistrict;
    const settlement = this.permission > 5 ? this.cities[0] : '';
    const serviceType = this.userServices.length === 1 ? this.userServices[0] : 0;

    this.displayedProviders = this.getProvidersByServiceType(serviceType);

    const serviceProvider =
      this.displayedProviders.length === 1 ? this.displayedProviders[0].id : '';

    this.locationForm.get('serviceType').valueChanges.subscribe(service => {
      this.displayedProviders = this.getProvidersByServiceType(service);

      const selectedProvider =
        this.displayedProviders.length === 1 ? this.displayedProviders[0].id : '';

      this.locationForm.patchValue({
        serviceProvider: selectedProvider
      });
    });

    setTimeout(() => {
      this.locationForm.patchValue({
        district,
        settlement,
        serviceType,
        serviceProvider
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

  clearForm(): void {
    this.additionalDataForm.reset();
    this.generalDataForm.reset();
    this.locationForm.reset();
    this.counterForm.reset();
    this.step = 0;
  }

  sendData(): void {
    const formIsValid = this.locationForm.valid && this.generalDataForm.valid;

    if (formIsValid) {
      const verification = this.getVerification();

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
    this.verificationSv.createVerification(this.getVerification()).subscribe();

    this.step = 1;

    this.locationForm.patchValue({
      counterQuantity: 1,
      serviceType: 1,
      serviceProvider: ''
    });
  }

  checkForDuplicates(): void {
    this.verificationSv.addVerification(this.getVerification());
  }

  getVerification(): VerificationDTO {
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

  private getProvidersByServiceType(serviceType: number) {
    if (!serviceType) {
      return this.userProviders;
    }

    return this.userProviders.filter(provider => provider.serviceType === serviceType);
  }

  private initForms(): void {
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
}

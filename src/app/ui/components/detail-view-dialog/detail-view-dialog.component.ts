import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { concat } from 'rxjs';

import { VerificationService } from '../../../services/verification.service';
import { ProvidersService } from '../../../services/providers.service';
import { VerificationDTO } from '../../../interfaces/verifications';
import { SourceService } from '../../../services/source.service';
import { DataService } from '../../../services/data.service';
import { IUser, ServiceTypes } from '../../../interfaces/user';

const typeUrl = 'http://165.22.83.21:3000/api/new-verifications/device';
const symbolUrl = 'http://165.22.83.21:3000/api/new-verifications/dn';

@Component({
  selector: 'app-detail-view-dialog',
  templateUrl: './detail-view-dialog.component.html',
  styleUrls: ['./detail-view-dialog.component.scss']
})
export class DetailViewDialogComponent implements OnInit {
  verification: VerificationDTO;
  additionalData: any;
  generalDataForm: FormGroup;
  locationForm: FormGroup;
  counterForm: FormGroup;
  additionalDataForm: FormGroup;

  permission: number;

  userProviders: any[];
  userServices: ServiceTypes[] = [];

  constructor(
    private fb: FormBuilder,
    private dataSv: DataService,
    private store: Store<number>,
    private sourceSv: SourceService,
    private providersSv: ProvidersService,
    private verificationSv: VerificationService,
    private dialogRef: MatDialogRef<DetailViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForms(this.data.verification[0]);
    this.store.pipe(select('permission')).subscribe(user => {
      this.permission = user.permission;

      this.setUpUserData(user);
    });

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
  }

  setUpUserData(user: IUser): void {
    this.userServices =
      user.serviceType === ServiceTypes.Both ? [1, 2] : [user.serviceType];

    this.userProviders =
      user.permission > 4
        ? [this.providersSv.getProvider(user.serviceProvider)]
        : this.providersSv.getProviders();
  }

  initForms(verification: VerificationDTO): void {
    const nameArr = this.data.verification[0].client.split(' ');
    const surname = nameArr[0];
    const name = nameArr[1];
    const middlename = nameArr[2];

    this.generalDataForm = this.fb.group({
      surname: surname,
      name: name,
      middlename: middlename,
      phoneNumber: verification.phoneNumber,
      additionalPhone: verification.additionalPhone
    });

    this.locationForm = this.fb.group({
      region: 'Волинська',
      district: verification.district,
      settlement: verification.settlement,
      street: verification.street,
      house: verification.house,
      apartment: verification.apartment,
      counterQuantity: verification.counterQuantity,
      serviceType: verification.serviceType,
      serviceProvider: verification.serviceProvider
    });

    const date = new Date();
    date.setMinutes(0);
    date.setHours(0);

    const time = verification.favorTime ? verification.favorTime.split(':') : [0, 0];
    const favorTime = new Date();
    favorTime.setHours(time[0]);
    favorTime.setMinutes(time[1]);

    this.additionalDataForm = this.fb.group({
      favorTime: favorTime,
      note: this.data.verification[0].note
    });
  }

  sendData(): void {
    this.verificationSv
      .updateVerification(
        this.data.verification[0].applicationNumber,
        this.setVerification()
      )
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

  setVerification(): VerificationDTO {
    const name = this.generalDataForm.get('name').value.replace("'", '`');
    const surname = this.generalDataForm.get('surname').value.replace("'", '`');

    const middlename = this.generalDataForm.get('middlename').value.replace("'", '`');

    const fullName = `${surname} ${name} ${middlename}`;
    const time = new Date(this.additionalDataForm.get('favorTime').value);

    return {
      ...this.generalDataForm.value,
      ...this.locationForm.value,
      ...this.additionalDataForm.value,
      client: fullName,
      favorTime: [time.getHours(), time.getMinutes()]
    };
  }
}

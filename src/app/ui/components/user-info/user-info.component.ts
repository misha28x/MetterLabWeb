import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  clientForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UserInfoComponent>,
    private clientSv: ClientService,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) {
    this.clientForm = new FormGroup({
      middlename: new FormControl(''),
      surName: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      additionalPhone: new FormControl(''),
      region: new FormControl(''),
      district: new FormControl(''),
      settlement: new FormControl(''),
      cityIndex: new FormControl(''),
      street: new FormControl(''),
      house: new FormControl(''),
      apartment: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.clientSv.fetchClientData(this.id);
    this.clientSv.getClientData().subscribe(clientData => {
      const lastName = clientData.client.split(' ')[0];
      const surName = clientData.client.split(' ')[2];
      const name = clientData.client.split(' ')[1];

      this.clientForm.patchValue({
        middlename: lastName,
        surName: surName,
        name: name,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        secondNumber: clientData.additionalPhone,
        region: clientData.region,
        district: clientData.district,
        settlement: clientData.settlement,
        cityIndex: clientData.cityIndex,
        street: clientData.street,
        house: clientData.house,
        apartment: clientData.apartment
      });
    });
  }

  saveClientInfo(): void {
    this.clientSv.updateClientInfo(this.id, this.clientForm.value);
    this.dialogRef.close();
  }
}

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ContractorService } from '../../../services/contractor.service';
import { CityService } from '../../../services/city.service';
import { IUser } from '../../../interfaces/user';

@Component({
  selector: 'app-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss', '../add-employee/add-employee.component.scss']
})
export class AddContractorComponent implements OnInit {
  contractorForm: FormGroup;

  permissions: Observable<any[]>;
  cities: Observable<any[]>;
  serviceProvider: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddContractorComponent>,
    private contractorSv: ContractorService,
    private citySv: CityService,
    private store: Store<IUser>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: IUser) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
        this.citySv.fetchCities();
      }
    });

    this.cities = this.citySv.getCities();

    if (typeof this.data === 'number') {
      this.title = 'Додати підрядника';

      this.contractorForm = new FormGroup({
        name: new FormControl(''),
        city_id: new FormControl(this.data || ''),
        permission: new FormControl('')
      });
    } else {
      this.title = 'Редагувати дані підрядника';

      this.contractorForm = new FormGroup({
        name: new FormControl(this.data.name),
        city_id: new FormControl(this.data.city_id || ''),
        permission: new FormControl(this.data.permission)
      });
    }

    this.permissions = this.contractorSv.getPermissions();
  }

  ngOnInit(): void {}

  saveContractor(): void {
    if (typeof this.data !== 'number') {
      const contractor = {
        ...this.data,
        ...this.contractorForm.value,
        provider: this.serviceProvider
      };
      this.contractorSv.editContractor(contractor).subscribe(() => this.contractorSv.fetchContractors);
    } else {
      const contractor = {
        ...this.contractorForm.value,
        provider: this.serviceProvider
      };

      this.contractorSv.addContractor(contractor).subscribe(() => this.contractorSv.fetchContractors);
    }
    this.dialogRef.close();
  }
}

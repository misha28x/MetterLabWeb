import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ContractorService } from '../../../services/contractor.service';
import { CityService } from '../../../services/city.service';
import { Contractor } from '../../../interfaces/contractor';
import { User } from '../../../interfaces/user';

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
    private store: Store<User>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: User) => {
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

  ngOnInit(): void { }

  saveContractor(): void {
    if (typeof this.data !== 'number') {
      console.log(this.data);
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

      console.log(contractor);

      this.contractorSv.addContractor(contractor).subscribe(() => this.contractorSv.fetchContractors);
    }
    this.dialogRef.close();
  }
}

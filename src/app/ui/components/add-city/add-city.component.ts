import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CityService } from '../../../services/city.service';
import { IUser } from '../../../interfaces/user';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss', '../add-employee/add-employee.component.scss']
})
export class AddCityComponent implements OnInit {
  cityForm: FormGroup;

  permissions: Observable<any[]>;
  serviceProvider: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddCityComponent>,
    private citySv: CityService,
    private store: Store<IUser>,
    @Inject(MAT_DIALOG_DATA) public city: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: IUser) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
      }
    });

    if (city) {
      this.title = 'Редагувати назву';

      this.cityForm = new FormGroup({
        name: new FormControl(this.city)
      });
    } else {
      this.title = 'Додати місто';
      this.cityForm = new FormGroup({
        name: new FormControl('')
      });
    }

    this.permissions = this.citySv.getPermissions();
  }

  ngOnInit(): void {}

  saveCity(): void {
    if (this.city) {
      this.citySv.editCity(this.cityForm.value).subscribe();
    } else {
      this.citySv.addCity(this.cityForm.value).subscribe();
    }
    this.dialogRef.close();
  }
}

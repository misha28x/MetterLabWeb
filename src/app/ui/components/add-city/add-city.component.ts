import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CityService } from '../../../services/city.service';
import { User } from '../../../interfaces/user';

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
    private store: Store<User>,
    @Inject(MAT_DIALOG_DATA) public city: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: User) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
      }
    });

    if (city) {
      this.title = 'Редагувати назву';

      this.cityForm = new FormGroup({
        name: new FormControl(this.city.user_name),
      });
    } else {
      this.title = 'Додати місто';
      this.cityForm = new FormGroup({
        name: new FormControl('')
      });
    }

    this.permissions = this.citySv.getPermissions();
  }

  ngOnInit(): void { }

  saveCity(): void {
    if (this.city) {
      this.citySv.editCity(this.cityForm.value).subscribe();
    } else {
      this.citySv.addCity(this.cityForm.value).subscribe();
    }
    this.dialogRef.close();
  }
}

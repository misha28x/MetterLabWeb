import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StationsService } from '../../../services/stations.service';
import { Station } from '../../../interfaces/station';
import { IUser } from '../../../interfaces/user';

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.scss']
})
export class AddStationComponent implements OnInit {
  stationForm: FormGroup;

  permissions: Observable<any[]>;
  serviceProvider: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddStationComponent>,
    private store: Store<IUser>,
    private stationsSv: StationsService,
    @Inject(MAT_DIALOG_DATA) public station: Station
  ) {
    this.store.pipe(select('permission')).subscribe((user: IUser) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
      }
    });

    if (station) {
      this.title = 'Редагувати дані станції';

      this.stationForm = new FormGroup({
        stationNumber: new FormControl(this.station.stationNumber),
        employeeName: new FormControl(this.station.employeeName),
        contactEmail: new FormControl(this.station.contactEmail),
        phoneNumber: new FormControl(this.station.phoneNumber),
        serviceProvider: new FormControl(this.serviceProvider)
      });
    } else {
      this.title = 'Додати станцію';
      this.stationForm = new FormGroup({
        stationNumber: new FormControl(''),
        employeeName: new FormControl(''),
        contactEmail: new FormControl(''),
        phoneNumber: new FormControl(''),
        serviceProvider: new FormControl(this.serviceProvider)
      });
    }

    this.permissions = this.stationsSv.getPermissions();
  }

  ngOnInit(): void {}

  saveStation(): void {
    if (this.station) {
      const station = {
        ...this.station,
        ...this.stationForm.value,
        provider: this.serviceProvider
      };
      this.stationsSv.editStation(station).subscribe();
    } else {
      const station = {
        ...this.stationForm.value,
        provider: this.serviceProvider
      };

      this.stationsSv.addStation(station).subscribe();
    }
    this.dialogRef.close();
  }
}

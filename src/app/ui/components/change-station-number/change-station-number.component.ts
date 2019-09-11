import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

interface DialogData {
  oldNumber: string;
  stations: Observable<string>;
}

@Component({
  selector: 'app-change-station-number',
  templateUrl: './change-station-number.component.html',
  styleUrls: ['./change-station-number.component.scss']
})
export class ChangeStationNumberComponent implements OnInit {
  stationNumbers$: Observable<string>;
  stationNumber: string;
  selectedNumber: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    const { stations, oldNumber } = this.data;

    this.selectedNumber = oldNumber;
    this.stationNumbers$ = stations;
  }
}

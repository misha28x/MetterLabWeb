import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { NewVerificationDialogComponent } from './new-verification-dialog/new-verification-dialog.component';
import { DataService } from '../../../services/data.service';
import { concat } from 'rxjs';

const employeeUrl = 'http://localhost:3000/api/new-verifications/employee';
const typeUrl = 'http://localhost:3000/api/new-verifications/device';
const symbolUrl = 'http://localhost:3000/api/new-verifications/dn';

@Component({
  selector: 'app-new-verification',
  templateUrl: './new-verification.component.html',
  styleUrls: ['./new-verification.component.scss']
})
export class NewVerificationComponent implements OnInit {

  constructor(
      private matDialog: MatDialog,
      private dataSv: DataService  
    ) { }

  ngOnInit(): void { }

	openDialg(dialogData: any): void {
    console.log(dialogData);

		this.matDialog.open(NewVerificationDialogComponent, {
			width: '85%',
			height: '98%',
      maxWidth: 1100,
      data: dialogData
		});
	}

  getData(): void {
    const $employeeObservable = this.dataSv.getData(employeeUrl);
    const $symbolObservable = this.dataSv.getData(symbolUrl);
    const $typeObservable = this.dataSv.getData(typeUrl);

    const dataObservable = concat($employeeObservable, $symbolObservable, $typeObservable);

    const dialogData = { };

    dataObservable.subscribe(
      (next: [any]) => {
        const key = Object.keys(next[0])[0];

        dialogData[key] = next.map( val =>  {
          return val[key];
        });
      },
      err => this.dataSv.handleError(err),
      () => this.openDialg(dialogData)
    );
  }
}

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { EndStateDialogComponent } from '../end-state-dialog/end-state-dialog.component';
import { StartStateDialogComponent } from '../start-state-dialog/start-state-dialog.component';
import { CounterDialogDataComponent } from '../counter-dialog-data/counter-dialog-data.component';
import { PhotoOrientationService } from '../../../../services/photo-orientation.service';
import { Protocol, Test } from '../../../../interfaces/protocol';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-protocol-dialog',
  templateUrl: './protocol-dialog.component.html',
  styleUrls: ['./protocol-dialog.component.scss']
})
export class ProtocolDialogComponent implements OnInit, OnDestroy {

  angle: number;
  subscription: Subscription;

  constructor(
      private dialog: MatDialog,
      private dataSv: DataService,
      private photoSv: PhotoOrientationService,
      @Inject(MAT_DIALOG_DATA) public data: Protocol
    ) { }

  ngOnInit(): void {
    this.subscription = this.photoSv.getAngleObservable().subscribe(angle => this.angle = angle);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.photoSv.setAngle(0);
  }
  formatData(data: string): string {
    return parseFloat(data).toFixed(2);
  }

  saveProtocol(): void { }

  saveTests(): void { }

  changeProtocolData(protocolData: Protocol): void { 
    this.dialog.open(CounterDialogDataComponent, {
      data: protocolData
    });
  }

  changeStartState(test: Test): void {
    const startRef = this.dialog.open(StartStateDialogComponent, {
      data: {
        base64Data: test.startStateImage,
        value: test.initValue
      }
    });

    startRef.afterClosed().subscribe(val => {
      if (val) {
        test.initValue = val;
        this.calculateExes(test);
      }
    });
  }

  changeEndState(test: Test): void {
    const endRef = this.dialog.open(EndStateDialogComponent, {
      data: {
        base64Data: test.endStateImage,
        value: test.finalValue
      }
    });

    endRef.afterClosed().subscribe(val => {
      if (val) {
        test.finalValue = val;
        this.calculateExes(test);
      }
    });
  }

  rotate(angle: number): void {
    this.photoSv.rotate(angle);
  }

  calculateExes(selectedTest: Test): void {
    selectedTest.counterCapacity = selectedTest.finalValue - selectedTest.initValue;
    const differ = selectedTest.counterCapacity - selectedTest.etalonCapacity;
    const calculatedFault = (differ * 100 / selectedTest.etalonCapacity);
    
    this.data.tests.map((test: Test) => {
      if (test.id === selectedTest.id) {
        test.calculatedFault = calculatedFault;
        if (Math.abs(test.calculatedFault) > test.assumedFault) {
          test.result = 'Не годен';
          this.data.result = 'Не годен';
        } else {
          test.result = 'Годен';
          const passed = this.data.tests.filter((currentTest: Test) => currentTest.result === 'Годен' || 'Не обработан').length;
          if (passed === this.data.tests.length) {
            this.data.result = 'Годен';
          }
        }
      }
    });
  }

  getImage(base64Data: string): any {
    return 'data:image/png;base64,' + base64Data.toString();
  }
}

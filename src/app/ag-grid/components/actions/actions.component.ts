import { Component } from '@angular/core';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  row: any;

  agInit(params: any): void {
    this.row = params.data;
  }
}

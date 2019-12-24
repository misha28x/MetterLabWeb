import { Component } from '@angular/core';

@Component({
  selector: 'app-date-renderer',
  templateUrl: './date-renderer.component.html',
  styleUrls: ['./date-renderer.component.scss']
})
export class DateRendererComponent {
  date: Date;

  agInit(params: any): void {
    this.date = params.value;
  }
}

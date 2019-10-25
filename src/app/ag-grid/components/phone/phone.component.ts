import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhoneComponent {
  phone: string;

  agInit(params: any): void {
    this.phone = params.value;
  }
}

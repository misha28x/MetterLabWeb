import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ServiceTypes } from '../../../interfaces/user';

@Component({
  selector: 'app-service-type-renderer',
  templateUrl: './service-type-renderer.component.html',
  styleUrls: ['./service-type-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceTypeRendererComponent {
  serviceType: string;

  agInit(params: any): void {
    this.serviceType =
      params.value === ServiceTypes.ColdWater ? 'Холодна вода' : 'Гаряча вода';
  }
}

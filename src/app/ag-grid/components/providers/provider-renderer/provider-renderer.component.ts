import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProvidersService } from '../../../../services/providers.service';

@Component({
  selector: 'app-provider-renderer',
  templateUrl: './provider-renderer.component.html',
  styleUrls: ['./provider-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderRendererComponent {
  provider: string;
  constructor(private providersSv: ProvidersService) {}

  agInit(params: any): void {
    this.provider = this.providersSv.getProviderById(params.value);
  }
}

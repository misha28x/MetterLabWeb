import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProvidersService, Provider } from '../../../../services/providers.service';

@Component({
  selector: 'app-provider-editor',
  templateUrl: './provider-editor.component.html',
  styleUrls: [
    '../../service-type/service-editor/service-editor.component.scss',
    './provider-editor.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderEditorComponent {
  provider: any;
  providers: Provider[];

  constructor(private providerSv: ProvidersService) {
    this.providers = this.providerSv.getProviders();
  }

  agInit(params: any): void {
    this.provider = params.value;
  }

  getValue(): any {
    return this.provider;
  }
}

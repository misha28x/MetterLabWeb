import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { ServiceTypes } from '../../../interfaces/user';

@Component({
  selector: 'app-service-editor',
  templateUrl: './service-editor.component.html',
  styleUrls: ['./service-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceEditorComponent {
  @ViewChild('select', { static: false }) select;
  serviceType: ServiceTypes;

  agInit(params: any): void {
    this.serviceType = params.value;
  }

  getValue(): ServiceTypes {
    return this.serviceType;
  }
}

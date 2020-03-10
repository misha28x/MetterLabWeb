import { IVerification, VerificationDTO } from '../interfaces/verifications';
import { Provider } from '../services/providers.service';

export class Verification implements IVerification {
  applicationNumber: string;
  addingDate: string;
  additionalPhone: string;
  apartment: string;
  client: string;
  district: string;
  employeeName: string;
  house: string;
  note: string;
  phoneNumber: string;
  serviceProvider: string;
  serviceType: string;
  settlement: string;
  street: string;
  taskDate: string;
  stationNumber: string;
  protocolDate: string;
  protocolNumber: string;
  suitableFor: string;

  constructor(verification: IVerification) {
    Object.assign(this, verification);
  }
}

export class VerificationAdapter {
  constructor(private providers: Map<number, Provider>) {}

  adapt(dto: VerificationDTO) {
    const verification: IVerification = {
      ...dto,
      phoneNumber: `+380${dto.phoneNumber}`,
      serviceType: dto.serviceType === 1 ? 'Холодна' : 'Гаряча',
      serviceProvider: this.getProviderName(+dto.serviceProvider)
    };

    return new Verification(verification);
  }

  private getProviderName(providerId: number): string {
    const provider = this.providers.get(providerId);

    return provider ? provider.name : 'Немає надавача';
  }
}

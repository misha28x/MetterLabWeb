import { Injectable } from '@angular/core';

export interface Provider {
  id: number;
  name: string;
  serviceType: number;
}

type ProviderMap = Map<number, Provider[]>;

const providers: ProviderMap = new Map([
  [39573623, [{ name: 'ПТМ «КОВЕЛЬТЕПЛО»', id: 39573623, serviceType: 2 }]],
  [13270431, [{ name: 'КП "ЛУЦЬКВОДОКАНАЛ"', id: 13270431, serviceType: 1 }]],
  [26366904, [{ name: 'ДКП «Луцьктепло»', id: 26366904, serviceType: 2 }]],
  [49672834, [{ name: 'УВГК "Ковельводоканал"', id: 49672834, serviceType: 1 }]],
  [73855324, [{ name: 'НОВОВОЛИНСЬКВОДОКАНАЛ', id: 73855324, serviceType: 1 }]],
  [
    94783653,
    [{ name: 'КП ВОЛОДИМИР-ВОЛИНСЬКТЕПЛОЕНЕРГО', id: 94783653, serviceType: 2 }]
  ],
  [
    15342645,
    [
      {
        name: 'УВКГ м.Володимира-Волинського',
        id: 15342645,
        serviceType: 1
      }
    ]
  ]
]);

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private _providers: Provider[];

  get providers() {
    if (!this._providers) {
      this._providers = this.getProviders();
    }

    return this._providers;
  }

  constructor() {}

  getProvider(id: number) {
    return providers.get(id);
  }

  getProviderById(id: number) {
    return this.providers.find(el => el.id === id).name;
  }

  getProviders(): Provider[] {
    const providersArr = Array.from(providers.values()).reduce((acc, provider) => {
      return [...acc, ...provider];
    }, []);

    return providersArr.reduce(this.getUniqueProviders, []);
  }

  private getUniqueProviders(acc: Provider[], cur: Provider) {
    if (acc.find(el => el.id === cur.id)) {
      return acc;
    }

    return [...acc, cur];
  }
}

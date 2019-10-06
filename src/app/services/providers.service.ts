import { Injectable } from '@angular/core';

interface Provider {
  id: number;
  name: string;
}

const providers = new Map([
  [13270431, 'КП "ЛУЦЬКВОДОКАНАЛ"'],
  [26366904, 'ДКП «Луцьктепло» '],
  [49672834, 'УВГК "Ковельводоканал"']
]);

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  constructor() {}

  public getProviderById(id: number): Provider {
    const name = providers.get(id);
    return { id, name };
  }

  public getProviders(): Provider[] {
    return Array.from(providers, ([key, value]) => ({ id: key, name: value }));
  }
}

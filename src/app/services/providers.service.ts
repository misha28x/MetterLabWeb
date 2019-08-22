import { Injectable } from '@angular/core';

const providers = {
  '80334': 'ТзОВ "ВОЛИНЬ АКВА СТАНДАРТ"',
  '13270431': 'КП "ЛУЦЬКВОДОКАНАЛ"',
  '26366904': 'ДКП «Луцьктепло» ',
  '91444871': 'ДП "Волиньстандартметрологія"'
};

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  constructor() { }

  public getProviderById(id: string): string {
    return providers[id];
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  filter = '';
  params: any;

  constructor() {
    console.log('filter');
  }

  agInit(params: any): void {
    this.params = params;
  }

  isFilterActive() {
    return this.filter !== '';
  }

  doesFilterPass(params) {
    const filter = this.filter.split('-');
    const gt = Number(filter[0]);
    const lt = Number(filter[1]);
    const value = this.params.valueGetter(params.node);

    return value >= gt && value <= lt;
  }

  getModel() {
    return { filter: this.filter };
  }

  setModel(model) {
    this.filter = model ? model.filter : '';
  }

  onSubmit(event) {
    event.preventDefault();

    const filter = event.target.elements.filter.value;

    if (this.filter !== filter) {
      this.filter = filter;
      this.params.filterChangedCallback();
    }
  }
}

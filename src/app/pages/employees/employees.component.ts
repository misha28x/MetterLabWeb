import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IUser } from '../../interfaces/user';
import { Station } from '../../interfaces/station';
import { Employee } from '../../interfaces/employee';
import { CityService } from '../../services/city.service';
import { MenuService } from '../../services/menu.service';
import { EmployeeService } from '../../services/employee.service';
import { StationsService } from '../../services/stations.service';
import { ContractorService } from '../../services/contractor.service';

import { AddEmployeeComponent } from '../../ui/components/add-employee';
import { AddStationComponent } from '../../ui/components/add-station';
import { DeleteDialogComponent } from '../../ui/components/delete-dialog';

import { AddCityComponent } from '../../ui/components/add-city';
import { AddContractorComponent } from '../../ui/components/add-contractor';

import { City } from '../../interfaces/city';
import { Contractor } from '../../interfaces/contractor';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class PageEmployeesComponent implements OnInit {
  employees: Observable<Employee[]>;
  contractors: Observable<Contractor[]>;
  cities: Observable<City[]>;
  permissions: any[];
  stations;

  user: IUser;

  step: number;

  constructor(
    private contractorSv: ContractorService,
    private employeeSv: EmployeeService,
    private stationsSv: StationsService,
    private citySv: CityService,
    private menuSv: MenuService,
    private store: Store<IUser>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe(_user => {
      this.employeeSv.fetchEmployees(_user.serviceProvider);
      this.stationsSv.fetchStations(_user.serviceProvider);
      this.contractorSv.fetchContractors();
      this.citySv.fetchCities();
      this.user = _user;
    });

    this.employeeSv
      .getPermissions()
      .subscribe(_permissions => (this.permissions = _permissions));

    this.contractors = this.contractorSv.getContractors();
    this.employees = this.employeeSv.getEmployees();
    this.stations = this.stationsSv.getStations();
    this.cities = this.citySv.getCities();
  }

  getMenu(contractor: Contractor): void {
    const user: IUser = {
      username: contractor.name,
      serviceProvider: contractor.id,
      permission: contractor.permission
    };
    this.menuSv.setVisitState(user);
  }

  getUserPermission(id: string): string {
    const permission = this.permissions.find(perm => perm.id === id);

    if (permission) {
      return permission.value;
    }

    return '...';
  }

  getContractorType(id: number): string {
    switch (id) {
      case 2:
        return 'Адмін';

      case 5:
        return 'Метрологія';

      case 6:
        return 'Надавач Послуг';

      default:
        return 'Підприємство';
    }
  }

  addEmployee(): void {
    const ref = this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px'
    });

    ref
      .afterClosed()
      .subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
  }

  editEmployee(employee: any): void {
    const ref = this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px',
      data: employee
    });

    ref
      .afterClosed()
      .subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
  }

  deleteEmployee(employee: Employee): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: {
        msg: 'видалити працівника'
      }
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.employeeSv
          .deleteEmployee(employee)
          .subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
      }
    });
  }

  addStation(): void {
    const ref = this.dialog.open(AddStationComponent, {
      minWidth: '600px'
    });

    ref
      .afterClosed()
      .subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
  }

  editStation(station: any): void {
    const ref = this.dialog.open(AddStationComponent, {
      minWidth: '600px',
      data: station
    });

    ref
      .afterClosed()
      .subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
  }

  deleteStation(station: Station): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: {
        msg: 'видалити станцію'
      }
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.stationsSv
          .deleteStation(station)
          .subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
      }
    });
  }

  addCity(): void {
    const ref = this.dialog.open(AddCityComponent, {
      minWidth: '600px'
    });

    ref.afterClosed().subscribe(() => this.citySv.fetchCities());
  }

  editCity(city: City): void {
    const ref = this.dialog.open(AddCityComponent, {
      minWidth: '600px',
      data: city.name
    });

    ref.afterClosed().subscribe(() => this.citySv.fetchCities());
  }

  deleteCity(city: City): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: {
        msg: 'видалити місто'
      }
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.citySv.deleteCity(city).subscribe(() => this.citySv.fetchCities());
      }
    });
  }

  addContractor(event: Event, city: City): void {
    event.preventDefault();
    event.stopPropagation();

    const ref = this.dialog.open(AddContractorComponent, {
      minWidth: '600px',
      data: city.id
    });

    ref.afterClosed().subscribe(() => this.contractorSv.fetchContractors());
  }

  editContractor(event: Event, contractor: Contractor): void {
    event.preventDefault();
    event.stopPropagation();

    const ref = this.dialog.open(AddContractorComponent, {
      minWidth: '600px',
      data: contractor
    });

    ref.afterClosed().subscribe(() => this.contractorSv.fetchContractors());
  }

  deleteContractor(event: Event, contractor: Contractor): void {
    event.preventDefault();
    event.stopPropagation();

    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: {
        msg: 'видалити підрядника'
      }
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.contractorSv
          .deleteContractor(contractor)
          .subscribe(() => this.contractorSv.fetchContractors());
      }
    });
  }
}

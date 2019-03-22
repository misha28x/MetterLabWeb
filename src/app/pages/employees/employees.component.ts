import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../interfaces/user';
import { Station } from '../../interfaces/station';
import { Employee } from '../../interfaces/employee';
import { CityService } from '../../services/city.service';
import { MenuService } from '../../services/menu.service';
import { EmployeeService } from '../../services/employee.service';
import { StationsService } from '../../services/stations.service';
import { ContractorService } from '../../services/contractor.service';
import { login } from '../../store/actions/permission.action';

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
  permissions: any[];
  stations;

  user: User;

  constructor(
    private contractorSv: ContractorService,
    private employeeSv: EmployeeService,
    private stationsSv: StationsService,
    private citySv: CityService,
    private menuSv: MenuService,
    private store: Store<User>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe( _user => {
      this.employeeSv.fetchEmployees(_user.serviceProvider);
      this.stationsSv.fetchStations(_user.serviceProvider);
      this.user = _user;
    });

    this.employeeSv.getPermissions().subscribe( _permissions => this.permissions = _permissions); 

    this.employees = this.employeeSv.getEmployees();
    this.stations = this.stationsSv.getStations();
  }

  getMenu(user: User): void {
    this.store.dispatch(login(user));
  }

  getUserPermission(id: string): string {
    const permission = this.permissions.find(perm => perm.id === id);

    if (permission) {
      return permission.value;
    }

    return '...';
  }

  addEmployee(): void {
    const ref = this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px'
    });

    ref.afterClosed().subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
  }

  editEmployee(employee: any): void {
    const ref = this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px',
      data: employee
    });

    ref.afterClosed().subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
  }

  deleteEmployee(employee: Employee): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'працівника'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.employeeSv.deleteEmployee(employee).subscribe(() => this.employeeSv.fetchEmployees(this.user.serviceProvider));
      }
    });
  }

  addStation(): void {
    const ref = this.dialog.open(AddStationComponent, {
      minWidth: '600px'
    });

    ref.afterClosed().subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
  }

  editStation(station: any): void {
    const ref = this.dialog.open(AddStationComponent, {
      minWidth: '600px',
      data: station
    });

    ref.afterClosed().subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
  }

  deleteStation(station: Station): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'станцію'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.stationsSv.deleteStation(station).subscribe(() => this.stationsSv.fetchStations(this.user.serviceProvider));
      }
    });
  }

  addCity(): void {
    this.dialog.open(AddCityComponent, {
      minWidth: '600px'
    });
  }

  editCity(city: City): void {
    this.dialog.open(AddCityComponent, {
      minWidth: '600px',
      data: city
    });
  }

  deleteCity(city: City): void {
    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'місто'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.citySv.deleteCity(city);
      }
    });
  }

  addContractor(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.dialog.open(AddContractorComponent, {
      minWidth: '600px'
    });
  }

  editContractor(event: Event, contractor: Contractor): void {
    event.preventDefault();
    event.stopPropagation();

    const ref = this.dialog.open(AddContractorComponent, {
      minWidth: '600px',
      data: contractor
    });

    ref.afterClosed().subscribe(() =>  this.contractorSv.fetchContractors(this.user.serviceProvider));
  }

  deleteContractor(event: Event, contractor: Contractor): void {
    event.preventDefault();
    event.stopPropagation();

    const ref = this.dialog.open(DeleteDialogComponent, {
      minWidth: '600px',
      data: 'підрядника'
    });

    ref.afterClosed().subscribe((result: string) => {
      if (result === 'delete') {
        this.citySv.deleteCity(contractor);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../interfaces/user';
import { Station } from '../../interfaces/station';
import { Employee } from '../../interfaces/employee';
import { MenuService } from '../../services/menu.service';
import { EmployeeService } from '../../services/employee.service';
import { StationsService } from '../../services/stations.service';

import { AddEmployeeComponent } from '../../ui/components/add-employee';
import { AddStationComponent } from '../../ui/components/add-station';
import { DeleteDialogComponent } from '../../ui/components/delete-dialog';

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
    private employeeSv: EmployeeService,
    private stationsSv: StationsService,
    private menuSv: MenuService,
    private store: Store<User>,
    private dialog: MatDialog) {

    }

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

  getMenu(permission: any, name: string): void {
    this.menuSv.setMenu(permission);
    this.menuSv.setVisitState({ state: true, name: name });
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

  addContractor(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
  }

  editContractor(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  deleteContractor(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}

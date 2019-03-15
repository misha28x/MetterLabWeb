import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../interfaces/user'
import { Employee } from '../../interfaces/employee';
import { MenuService } from '../../services/menu.service';
import { EmployeeService } from '../../services/employee.service';
import { AddEmployeeComponent } from '../../ui/components/add-employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class PageEmployeesComponent implements OnInit {
  employees: Observable<Employee[]>;
  stations;

  user: User;

  constructor(
    private employeeSv: EmployeeService,
    private menuSv: MenuService,
    private store: Store<User>,
    private dialog: MatDialog) {

    }

  ngOnInit(): void {
    this.store.pipe(select('permission')).subscribe( _user => {
      this.employeeSv.fetchEmployees(_user.serviceProvider);
      this.user = _user;
    });

    this.employees = this.employeeSv.getEmployees();
    this.stations = ['10133', '10159'];
  }

  getMenu(permission: any, name: string): void {
    this.menuSv.setMenu(permission);
    this.menuSv.setVisitState({ state: true, name: name });
  }

  getEmployees(): void {
    this.employeeSv.getEmployees();
  }

  addEmployee(): void {
    this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px'
    });
  }

  editEmployee(employee: any): void {
    this.dialog.open(AddEmployeeComponent, {
      minWidth: '600px',
      data: employee
    });
  }
}

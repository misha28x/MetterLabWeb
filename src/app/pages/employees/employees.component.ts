import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MenuService } from '../../services/menu.service';
import { AddEmployeeComponent } from '../../ui/components/add-employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class PageEmployeesComponent implements OnInit {
  employees;
  stations;

  constructor(private menuSv: MenuService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.employees = ['Працівник - 1', 'Працівник - 2'];
    this.stations = ['10133', '10159'];
  }

  getMenu(permission: any, name: string): void {
    this.menuSv.setMenu(permission);
    this.menuSv.setVisitState({ state: true, name: name });
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

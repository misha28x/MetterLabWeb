import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EmployeeService } from '../../../services/employee.service';
import { IUser } from '../../../interfaces/user';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  permissions: Observable<any[]>;
  serviceProvider: string;
  user: IUser;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private store: Store<IUser>,
    private employeeSv: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public employee: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: IUser) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
      }

      this.user = user;
    });

    if (employee) {
      this.title = 'Редагувати дані працівника';

      this.employeeForm = new FormGroup({
        full: new FormControl(this.employee.user_full_name),
        name: new FormControl(this.employee.user_name),
        password: new FormControl(this.employee.user_password),
        permissions: new FormControl(this.employee.user_permissions)
      });
    } else {
      this.title = 'Додати працівника';
      this.employeeForm = new FormGroup({
        full: new FormControl(''),
        name: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        permissions: new FormControl('')
      });
    }

    this.permissions = this.employeeSv.getPermissions();
  }

  ngOnInit(): void {}

  saveEmployee(): void {
    if (this.employee) {
      const employee = {
        ...this.employee,
        ...this.employeeForm.value,
        serviceProvider: this.serviceProvider
      };
      this.employeeSv.editEmployee(employee).subscribe();
    } else {
      const employee = {
        ...this.employeeForm.value,
        serviceProvider: this.serviceProvider
      };

      this.employeeSv.addEmployee(employee).subscribe();
    }
    this.dialogRef.close();
  }
}

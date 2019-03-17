import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EmployeeService } from '../../../services/employee.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  permissions: Observable<any[]>;
  serviceProvider: string;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private store: Store<User>,
    private employeeSv: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public employee: any
  ) {
    this.store.pipe(select('permission')).subscribe((user: User) => {
      if (user.serviceProvider) {
        this.serviceProvider = user.serviceProvider;
      }
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

  ngOnInit(): void { }

  saveEmployee(): void {
    if (this.employee) {
      const employee = {
        ...this.employee,
        ...this.employeeForm.value,
        provider: this.serviceProvider
      };
      this.employeeSv.editEmployee(employee).subscribe();
    } else {
      const employee = {
        ...this.employeeForm.value,
        provider: this.serviceProvider
      };

      this.employeeSv.addEmployee(employee).subscribe();
    }
    this.dialogRef.close();
  }
}

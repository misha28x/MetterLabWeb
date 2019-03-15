import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  title: string;

  constructor(
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private employeeSv: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public employee: any) {
    this.employeeForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl(''),
      password: new FormControl(''),
      permissions: new FormControl('')
    });

    if (employee) {
      this.title = 'Редагувати дані працівника';
      this.employeeForm = new FormGroup({
        name: new FormControl(this.employee.user_full_name),
        email: new FormControl(this.employee.user_name),
        // phoneNumber: new FormControl(''),
        password: new FormControl(this.employee.user_password),
        permissions: new FormControl(this.employee.user_password)
      });
    } else {
      this.title = 'Додати працівника';
    }
  }

  ngOnInit(): void {

  }

  saveEmployee(): void {
    if (this.employee) {
      const employee = {
        ...this.employee,
        ...this.employeeForm.value
      };

      this.employeeSv.editEmployee(employee).subscribe();
    } else {
      this.employeeSv.addEmployee(this.employeeForm.value).subscribe();
    }
  }
}

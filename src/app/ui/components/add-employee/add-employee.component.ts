import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddEmployeeComponent>,
    private clientSv: ClientService,
    @Inject(MAT_DIALOG_DATA) public id: string) {
    this.employeeForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      phoneNumber: new FormControl('')
    });
  }

  ngOnInit(): void {

  }

  saveClientInfo(): void {
    this.clientSv.updateClientInfo(this.id, this.employeeForm.value);
    this.dialogRef.close();
  }
}

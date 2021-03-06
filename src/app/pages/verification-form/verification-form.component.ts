import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verification-form',
  templateUrl: './verification-form.component.html',
  styleUrls: [
    '../../ui/components/new-verification/new-verification-dialog/new-verification-dialog.component.scss',
    './verification-form.component.scss'
  ]
})
export class VerificationFormComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      surname: '',
      name: '',
      middlename: '',
      phone: '380',
      mail: '',
      ipn: '',
      region: '',
      district: '',
      settlement: '',
      index: '',
      street: '',
      house: '',
      apartment: '',
      isUnique: false,
      counterQuantity: 0,
      serviceType: 1,
      serviceProvider: '',
      comment: ''
    });
  }

  ngOnInit(): void {}
}

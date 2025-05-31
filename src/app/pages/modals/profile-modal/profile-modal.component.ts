import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../../../data/interfaces/user-data.interfaces';
import { spacesCheck, emailValidator, ageValidator } from '../../../shared/validators';
import { CommonModule } from '@angular/common';
import { EditFormValue } from '../../../udate-services/udate-user-info/update-user-info.interfaces';

@Component({
  selector: 'app-profile-modal',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css',
})
export class ProfileModalComponent implements OnInit {
  public editForm!: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    dateOfBirth: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private dialogReference: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
  ) {}

  public ngOnInit(): void {
    this.editForm = this.fb.nonNullable.group({
      firstName: [
        this.data?.firstName ?? '',
        [Validators.required.bind(Validators), Validators.pattern('^[A-z]+$')],
      ],
      lastName: [
        this.data?.lastName ?? '',
        [Validators.required.bind(Validators), Validators.pattern('^[A-z]+$')],
      ],
      email: [
        this.data?.email ?? '',
        [Validators.required.bind(Validators), spacesCheck(), emailValidator()],
      ],
      dateOfBirth: [
        this.data?.dateOfBirth ?? '',
        [Validators.required.bind(Validators), ageValidator()],
      ],
    });
  }

  public save(): void {
    if (this.editForm.valid) {
      const data: EditFormValue = this.editForm.getRawValue();
      this.dialogReference.close(data);
    }
  }

  public close(): void {
    this.dialogReference.close();
  }
}

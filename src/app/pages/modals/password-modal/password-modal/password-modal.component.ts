import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { spacesCheck, passwordValidator } from '../../../../shared/validators';
import { ProfileModalComponent } from '../../profile-modal/profile-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../../data/interfaces/user-data.interfaces';
import { UpdatePasswordService } from '../../../../udate-services/update-password/update-password.service';
import { CustomerChangePassword } from '../../../../udate-services/update-password/update-password.interfaces';

@Component({
  selector: 'app-password-modal',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css',
})
export class PasswordModalComponent implements OnInit {
  public passwordForm!: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
  }>;
  constructor(
    public updatePasswordService: UpdatePasswordService,
    public dialogReference: MatDialogRef<ProfileModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
  ) {}

  public ngOnInit(): void {
    this.passwordForm = this.fb.nonNullable.group({
      currentPassword: ['', Validators.required.bind(Validators)],
      newPassword: ['', [Validators.required.bind(Validators), spacesCheck(), passwordValidator()]],
    });
  }

  public save(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    const payload: CustomerChangePassword = {
      id: this.data.id,
      version: this.data.version,
      currentPassword,
      newPassword,
    };

    this.updatePasswordService.update(this.data.id, payload).subscribe({
      next: response => {
        this.dialogReference.close(response);
      },
    });
  }

  public close(): void {
    this.dialogReference.close();
  }
}

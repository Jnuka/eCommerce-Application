import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { spacesCheck, passwordValidator } from '../../../../shared/validators';
import { ProfileModalComponent } from '../../profile-modal/profile-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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
  public passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogReference: MatDialogRef<ProfileModalComponent>,
  ) {}

  public ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required.bind(Validators)],
      newPassword: ['', [Validators.required.bind(Validators), spacesCheck(), passwordValidator()]],
    });
  }

  public save(): void {
    if (this.passwordForm.valid) {
      const data = this.passwordForm.value;
      this.dialogReference.close(data);
    }
  }

  public close(): void {
    this.dialogReference.close();
  }
}

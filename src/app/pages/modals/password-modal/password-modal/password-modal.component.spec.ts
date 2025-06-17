import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { PasswordModalComponent } from './password-modal.component';
import { of } from 'rxjs';

describe('PasswordModalComponent', () => {
  let httpTestingController: HttpTestingController;

  let component: PasswordModalComponent;
  let fixture: ComponentFixture<PasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'mock-id',
            version: 1,
          },
        },
      ],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(PasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty controls', () => {
    expect(component.passwordForm).toBeDefined();
    expect(component.passwordForm.get('currentPassword')?.value).toBe('');
    expect(component.passwordForm.get('newPassword')?.value).toBe('');
  });

  it('should not call update if form is invalid', () => {
    component.passwordForm.setValue({ currentPassword: '', newPassword: '' });
    spyOn(component.updatePasswordService, 'update').and.callThrough();

    component.save();

    expect(component.updatePasswordService.update).not.toHaveBeenCalled();
  });

  it('should call update and close dialog on success', () => {
    component.passwordForm.setValue({ currentPassword: 'oldPass', newPassword: 'newPass123' });

    const updateSpy = spyOn(component.updatePasswordService, 'update').and.returnValue(
      of({
        id: 'mock-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        password: 'newPass123',
        addresses: [],
        shippingAddressIds: [],
        billingAddressIds: [],
        version: 2,
      }),
    );

    component.save();

    expect(updateSpy).toHaveBeenCalledWith('mock-id', {
      id: 'mock-id',
      version: 1,
      currentPassword: 'oldPass',
      newPassword: 'newPass123',
    });
    expect(component.dialogReference.close).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 'mock-id' }),
    );
  });

  it('should close dialog on close()', () => {
    component.close();
    expect(component['dialogReference'].close).toHaveBeenCalled();
  });
});

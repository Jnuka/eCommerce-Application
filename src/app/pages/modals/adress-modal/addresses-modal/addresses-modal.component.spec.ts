import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddressesModalComponent } from './addresses-modal.component';
/* eslint-disable */

describe('AddressesModalComponent', () => {
  let component: AddressesModalComponent;
  let fixture: ComponentFixture<AddressesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressesModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            address: {
              id: '',
              streetName: '',
              postalCode: '',
              city: '',
              country: '',
              isShipping: false,
              isBilling: false,
              isDefaultShipping: false,
              isDefaultBilling: false,
              isDefault: false,
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not close the dialog if the form is invalid', () => {
    component.addressEditForm.patchValue({
      streetName: '',
      postalCode: '123',
      city: '',
      country: '',
    });

    component.save();

    expect(component['dialogReference'].close).not.toHaveBeenCalled();
  });
  it('should close the dialog with form data if the form is valid', () => {
    component.addressEditForm.setValue({
      id: '1',
      streetName: 'Main St',
      postalCode: '12345',
      city: 'Barcelona',
      country: 'ES',
      isShipping: true,
      isBilling: false,
      isDefaultShipping: true,
      isDefaultBilling: false,
      isDefault: true,
    });

    component.save();

    expect(component['dialogReference'].close).toHaveBeenCalledWith(
      jasmine.objectContaining({ streetName: 'Main St' }),
    );
  });
  it('should close the dialog when close() is called', () => {
    component.close();
    expect(component['dialogReference'].close).toHaveBeenCalledWith();
  });
});

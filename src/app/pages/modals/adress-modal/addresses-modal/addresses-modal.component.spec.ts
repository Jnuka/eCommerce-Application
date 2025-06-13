import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddressesModalComponent } from './addresses-modal.component';

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
});

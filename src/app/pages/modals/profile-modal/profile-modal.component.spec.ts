import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProfileModalComponent } from './profile-modal.component';
/* eslint-disable */

describe('ProfileModalComponent', () => {
  let component: ProfileModalComponent;
  let fixture: ComponentFixture<ProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            dateOfBirth: '1990-01-01',
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not close the dialog if the form is invalid', () => {
    component.editForm.patchValue({
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      dateOfBirth: '2015-01-01',
    });

    component.save();

    expect(component['dialogReference'].close).not.toHaveBeenCalled();
  });

  it('should close the dialog with form data if the form is valid', () => {
    component.editForm.setValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: '1992-05-15',
    });

    component.save();

    expect(component['dialogReference'].close).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: '1992-05-15',
    });
  });
  it('should close the dialog without data', () => {
    component.close();
    expect(component['dialogReference'].close).toHaveBeenCalledWith();
  });
  it('should initialize form with default values if data is undefined', () => {
    const testComponent = TestBed.createComponent(ProfileModalComponent);
    const instance = testComponent.componentInstance;
    instance.data = {} as any;

    instance.ngOnInit();

    expect(instance.editForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
    });
  });
  it('should invalidate firstName with numbers', () => {
    component.editForm.get('firstName')!.setValue('John123');
    expect(component.editForm.get('firstName')!.valid).toBeFalse();
  });
  it('should invalidate incorrect email', () => {
    component.editForm.get('email')!.setValue('invalid@');
    expect(component.editForm.get('email')!.valid).toBeFalse();
  });
  it('should invalidate too young dateOfBirth', () => {
    component.editForm.get('dateOfBirth')!.setValue('2020-01-01');
    expect(component.editForm.get('dateOfBirth')!.valid).toBeFalse();
  });
});

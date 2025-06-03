import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { UserProfileComponent } from './user-profile.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProfileModalComponent } from '../../modals/profile-modal/profile-modal.component';
import { PasswordModalComponent } from '../../modals/password-modal/password-modal/password-modal.component';
/* eslint-disable */

describe('UserProfileComponent', () => {
  let httpTestingController: HttpTestingController;

  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  interface ProfileModalReturnData {
    email: string;
    firstName: string;
    lastName: string;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open ProfileModalComponent when tab index is 0 and save data on close', () => {
    component.selectedTabIndex = 0;

    const dialogReferenceSpy: Partial<MatDialogRef<ProfileModalComponent, ProfileModalReturnData>> =
      {
        afterClosed: () =>
          of({
            email: 'new@mail.com',
            firstName: 'New',
            lastName: 'User',
          }),
      };

    const dialog = TestBed.inject(MatDialog);
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(
      dialogReferenceSpy as MatDialogRef<ProfileModalComponent, ProfileModalReturnData>,
    );

    const saveSpy = spyOn(component, 'savePersonalInfo');

    component.openModal();

    expect(dialogSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        email: 'new@mail.com',
        firstName: 'New',
        lastName: 'User',
      }),
    );
  });

  it('should open PasswordModalComponent and save data on close', () => {
    const dialogReferenceSpy: Partial<MatDialogRef<PasswordModalComponent, { email: string }>> = {
      afterClosed: () => of({ email: 'updated@mail.com' }),
    };

    const dialog = TestBed.inject(MatDialog);
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(
      dialogReferenceSpy as MatDialogRef<PasswordModalComponent, { email: string }>,
    );

    const saveSpy = spyOn(component, 'savePersonalInfo');

    component.openPasswordModal();

    expect(dialogSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  });
});

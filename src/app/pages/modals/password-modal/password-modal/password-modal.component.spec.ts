import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { PasswordModalComponent } from './password-modal.component';

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
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { RegistrationPageComponent } from './registration-page.component';
import { FormControl, FormsModule } from '@angular/forms';
import {
  cityValidator,
  emailValidator,
  passwordValidator,
  spacesCheck,
} from '../../shared/validators';
import { MatInputModule } from '@angular/material/input';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPageComponent, MatInputModule, FormsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Custom validators testing', () => {
  it('should return error if email doesn`t not contain @', () => {
    const control = new FormControl('', emailValidator());

    expect(control.errors).toBeNull();

    control.setValue('user123');
    expect(control.errors).toBeTruthy();
    expect(control.errors?.['dog']).toBeTrue();

    control.setValue('ywer123@');
    expect(control.errors).toBeTruthy();
    expect(control.errors?.['domain']).toBeTrue();

    control.setValue('ywer123@.yu');
    expect(control.errors).toBeTruthy();
    expect(control.errors?.['email']).toBeTrue();

    control.setValue('rew@mail.ru');
    expect(control.errors).toBeNull();
  });

  it('should return error if input contains spaces', () => {
    const control = new FormControl(' ywer123@mail.yu ', spacesCheck());
    expect(control.errors).toBeTruthy();
    expect(control.errors?.['containSpaces']).toBeTrue();

    control.setValue('rew@mail.ru');
    expect(control.errors).toBeNull();
  });

  it('should return error if password doesn`t not contain lower-case letter', () => {
    const control = new FormControl(' @#$ASAD123', passwordValidator());
    expect(control.errors?.['lower']).toBeTrue();
  });

  it('should return error if password doesn`t not contain upper-case letter', () => {
    const control = new FormControl(' ywer123@mail.yu ', passwordValidator());
    expect(control.errors?.['upper']).toBeTrue();
  });

  it('should return error if password doesn`t not contain number', () => {
    const control = new FormControl(' yWer@mail.yu ', passwordValidator());
    expect(control.errors?.['number']).toBeTrue();
  });

  it('should return error if password length less then 8', () => {
    const control = new FormControl('dadQW1', passwordValidator());
    expect(control.errors?.['length']).toBeTrue();
  });

  it('should return error if city is not valid', () => {
    const control = new FormControl('   $', cityValidator());
    expect(control.errors?.['city']).toBeTrue();
  });
});

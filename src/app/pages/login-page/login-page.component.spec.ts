import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { LoginPageComponent } from './login-page.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let httpTestingController: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Hide password function', () => {
    it('should update the DOM', () => {
      const previousValue = component.hidePassword();
      const click = new MouseEvent('click');
      component.clickEvent(click);
      fixture.detectChanges();
      const actualValue = component.hidePassword();
      expect(!previousValue).toBe(actualValue);
    });
  });

  describe('Navigate', () => {
    it('should navigate to registration', fakeAsync(async () => {
      await component.goRegistration();
      tick();
      expect(routerMock.navigate).toHaveBeenCalledWith(['registration']);
    }));

    it('should navigate to main page', fakeAsync(async () => {
      await component.goMain();
      expect(routerMock.navigate).toHaveBeenCalledWith(['']);
    }));
  });

  describe('Form Submit', () => {
    beforeEach(() => {
      component.loginForm.setValue({
        email: 'hello@mail.ru',
        password: '1234qweR',
      });
    });

    it('should call authService.login on valid form', () => {
      authService.login.and.returnValue(
        of({
          customer: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            password: '',
            addresses: [
              {
                id: '',
                country: '',
                streetName: '',
                city: '',
                postalCode: '',
              },
              {
                id: '',
                country: '',
                streetName: '',
                city: '',
                postalCode: '',
              },
            ],
            shippingAddressIds: [''],
            billingAddressIds: [''],
            version: 1,
          },
        }),
      );
      component.onSubmit();
      /* eslint-disable */
      expect(authService.login).toHaveBeenCalledWith({
        email: 'hello@mail.ru',
        password: '1234qweR',
      });
      /* eslint-enable */
    });

    it('should after successful login navigate to main page', fakeAsync(() => {
      authService.login.and.returnValue(
        of({
          customer: {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            password: '',
            addresses: [
              {
                id: '',
                country: '',
                streetName: '',
                city: '',
                postalCode: '',
              },
              {
                id: '',
                country: '',
                streetName: '',
                city: '',
                postalCode: '',
              },
            ],
            shippingAddressIds: [''],
            billingAddressIds: [''],
            version: 1,
          },
        }),
      );
      component.onSubmit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['']);
    }));

    it('should not submit when form is invalid', () => {
      component.loginForm.setErrors({ invalid: true });
      component.onSubmit();
      /* eslint-disable */
      expect(authService.login).not.toHaveBeenCalled();
      /* eslint-enable */
    });
  });

  describe('Form validate errors', () => {
    it('should email validation field is required', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes('This field is required'),
        ).toBeTruthy();
      }
    });

    it('should email validation delete spaces', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('text @mail.ru');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(By.css('mat-error'));
      expect(
        errors.some(error => {
          if (error.nativeElement instanceof HTMLElement) {
            return error.nativeElement.textContent?.includes('Please, delete spaces.');
          } else {
            return false;
          }
        }),
      ).toBeTrue();
    });
    it('should email validation must contain a domain name', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('@');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes(
            'Email address must contain a domain name.',
          ),
        ).toBeTruthy();
      }
    });
    it('should email validation must contain an @ symbol', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('hello');
      emailControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes(
            "Email address must contain an '@' symbol.",
          ),
        ).toBeTruthy();
      }
    });
    it('should password validation field is required', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes('This field is required.'),
        ).toBeTruthy();
      }
    });
    it('should password validation delete spaces', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password ');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(By.css('mat-error'));
      expect(
        errors.some(error => {
          if (error.nativeElement instanceof HTMLElement) {
            return error.nativeElement.textContent?.includes('Please, delete spaces.');
          } else {
            return false;
          }
        }),
      ).toBeTrue();
    });
    it('should password validation contain at least 1 upper-case letter', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('password');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes(
            'Must contain at least 1 upper-case letter.',
          ),
        ).toBeTruthy();
      }
    });
    it('should password validation contain at least 1 lower-case letter', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('PASSWORD');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes(
            'Must contain at least 1 lower-case letter.',
          ),
        ).toBeTruthy();
      }
    });
    it('should password validation contain at least 1 number', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('Password');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes('Must contain at least 1 number.'),
        ).toBeTruthy();
      }
    });
    it('should password validation contain at least 8 characters', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('Pass1');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      if (errorElement.nativeElement instanceof HTMLElement) {
        expect(
          errorElement.nativeElement.textContent?.includes('Must contain at least 8 characters'),
        ).toBeTruthy();
      }
    });
  });
});

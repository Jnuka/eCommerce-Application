import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { RegistrationService } from './registration.service';
import { AuthService } from '../auth/auth.service';
import { CtpApiService } from '../data/services/ctp-api.service';
import { ToastService } from '../helpers/toast.service';
import { CustomerDraft } from './registration.interfaces';
import { of } from 'rxjs';
import { Customer, CustomerSignInResult } from '../data/interfaces/user-data.interfaces';

describe('RegistrationService', () => {
  let httpTestingController: HttpTestingController;
  let service: RegistrationService;
  const ctpApiServiceSpy = jasmine.createSpyObj<CtpApiService>('CtpApiService', ['getAccessToken']);
  const toastServiceSpy = jasmine.createSpyObj<ToastService>('ToastService', ['success']);
  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
    'login',
    'getCustomerToken',
  ]);

  const testCustomer: Customer = {
    id: 'test-id',
    email: 'test@example.com',
    firstName: 'MAsha',
    lastName: 'Hello',
    dateOfBirth: '2002-11-23',
    password: 'aywge',
    addresses: [
      {
        id: 'sdf',
        country: 'US',
        streetName: 'Main Street',
        city: 'New York',
        postalCode: '12345',
      },
      {
        id: 'dff',
        country: 'US',
        streetName: 'Second Street',
        city: 'New York',
        postalCode: '54321',
      },
    ],
    shippingAddressIds: ['sdfsdf'],
    billingAddressIds: ['fsdfd'],
    version: 1,
  };

  const mockResult: CustomerSignInResult = {
    customer: testCustomer,
  };

  const testCustomerDraft: CustomerDraft = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '2000-01-01',
    authenticationMode: 'Password',
    isEmailVerified: false,
    addresses: [
      {
        country: 'US',
        streetName: 'Main Street',
        city: 'New York',
        postalCode: '12345',
      },
      {
        country: 'US',
        streetName: 'Second Street',
        city: 'New York',
        postalCode: '54321',
      },
    ],
    defaultShippingAddress: 0,
    shippingAddresses: [0],
    defaultBillingAddress: 1,
    billingAddresses: [1],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegistrationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CtpApiService, useValue: ctpApiServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RegistrationService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register and login the user', fakeAsync(() => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of('mockToken'));
    authServiceSpy.login.and.returnValue(of(mockResult));

    service.signUp(testCustomerDraft).subscribe(result => {
      expect(result).toBeTruthy();
    });

    const request = httpTestingController.expectOne(request => request.method === 'POST');
    expect(request.request.headers.get('Authorization')).toBe('Bearer mockToken');
    request.flush(testCustomerDraft);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(toastServiceSpy.success).toHaveBeenCalledWith('Successful registration');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: testCustomerDraft.email,
      password: testCustomerDraft.password,
    });

    tick();
  }));

  it('should handle missing access token', () => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of(null));

    service.signUp(testCustomerDraft).subscribe({
      error: error => {
        expect(error).toEqual(new Error('No access token available'));
      },
    });
  });
});

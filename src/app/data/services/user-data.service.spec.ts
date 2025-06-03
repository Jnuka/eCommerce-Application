import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { UserDataService } from './user-data.service';
import { CookieService } from 'ngx-cookie-service';
import { CustomerSignInResult } from '../interfaces/user-data.interfaces';
import { environment } from '../../../environments/environment';
/* eslint-disable */

describe('UserDataService', () => {
  let httpTestingController: HttpTestingController;
  let service: UserDataService;
  let cookieService: jasmine.SpyObj<CookieService>;

  const mockToken = 'mock-token';
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';

  const mockCustomerSignInResult: CustomerSignInResult = {
    customer: {
      id: '1',
      email: mockEmail,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      password: 'hashed',
      addresses: [
        {
          id: 'address-1',
          streetName: 'Main St',
          postalCode: '12345',
          city: 'City',
          country: 'US',
        },
      ],
      defaultBillingAddressId: 'address-1',
      shippingAddressIds: ['address-1'],
      billingAddressIds: ['address-1'],
      defaultShippingAddressId: 'address-1',
      version: 1,
    },
  };

  beforeEach(() => {
    const cookieSpy = jasmine.createSpyObj('CookieService', ['get']);
    TestBed.configureTestingModule({
      providers: [
        UserDataService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: cookieSpy },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserDataService);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });
  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#loginCustomer', () => {
    it('should send POST request and update _customerData signal', done => {
      cookieService.get.and.returnValue(mockToken);

      service.loginCustomer(mockEmail, mockPassword).subscribe(response => {
        expect(response).toEqual(mockCustomerSignInResult);
        const customerData = service.customerData();
        expect(customerData?.customAddresses?.length).toBe(1);
        expect(customerData?.customer.email).toBe(mockEmail);
        done();
      });

      const request = httpTestingController.expectOne(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
      );
      expect(request.request.method).toBe('POST');
      expect(request.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(request.request.body).toEqual({ email: mockEmail, password: mockPassword });

      request.flush(mockCustomerSignInResult);
    });
  });

  describe('#autoLogin', () => {
    it('should return null if token, email or password missing', () => {
      cookieService.get.and.returnValues('', '', '');
      expect(service.autoLogin()).toBeNull();
    });

    it('should send POST request and update _customerData signal if cookies exist', done => {
      cookieService.get.and.callFake((key: string) => {
        if (key === 'token') return mockToken;
        if (key === 'user_email') return mockEmail;
        if (key === 'user_password') return mockPassword;
        return '';
      });

      service.autoLogin()?.subscribe(response => {
        expect(response).toEqual(mockCustomerSignInResult);
        const customerData = service.customerData();
        expect(customerData?.customAddresses?.length).toBe(1);
        expect(customerData?.customer.email).toBe(mockEmail);
        done();
      });

      const request = httpTestingController.expectOne(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
      );
      expect(request.request.method).toBe('POST');
      expect(request.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

      request.flush(mockCustomerSignInResult);
    });
  });
});

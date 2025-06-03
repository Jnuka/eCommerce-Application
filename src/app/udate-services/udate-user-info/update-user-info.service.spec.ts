import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { UpdateUserInfoService } from './update-user-info.service';
import { CtpApiService } from '../../data/services/ctp-api.service';
import { ToastService } from '../../helpers/toast.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateCustomerResult } from './update-user-info.interfaces';
/* eslint-disable */

describe('UpdateUserInfoService', () => {
  let httpTestingController: HttpTestingController;
  let service: UpdateUserInfoService;
  let ctpApiServiceSpy: jasmine.SpyObj<CtpApiService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const mockToken = 'mock-token';
  const mockCustomerId = '12345';
  const mockUpdateCustomer = { version: 1, actions: [] };
  const mockResponse: UpdateCustomerResult = {
    id: 'mock-id',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    password: 'hashed-password',
    addresses: [
      {
        id: 'address-1',
        streetName: 'Main Street',
        postalCode: '12345',
        city: 'New York',
        country: 'US',
      },
    ],
    defaultBillingAddressId: 'address-1',
    shippingAddressIds: ['address-1'],
    billingAddressIds: ['address-1'],
    defaultShippingAddressId: 'address-1',
    version: 2,
  };

  beforeEach(() => {
    const ctpSpy = jasmine.createSpyObj('CtpApiService', ['getAccessToken']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    TestBed.configureTestingModule({
      providers: [
        UpdateUserInfoService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CtpApiService, useValue: ctpSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UpdateUserInfoService);
    ctpApiServiceSpy = TestBed.inject(CtpApiService) as jasmine.SpyObj<CtpApiService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });
  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HTTP POST with correct headers and body, then call toast success', done => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of(mockToken));

    service.update(mockCustomerId, mockUpdateCustomer).subscribe({
      next: response => {
        expect(response).toEqual(mockResponse);
        expect(toastServiceSpy.success).toHaveBeenCalledWith('Successful update');
        done();
      },
      error: () => fail('Should not error'),
    });

    const request = httpTestingController.expectOne(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${mockCustomerId}`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(request.request.headers.get('Content-Type')).toBe('application/json');
    expect(request.request.body).toEqual(mockUpdateCustomer);

    request.flush(mockResponse);
  });

  it('should show error toast and throw error on HTTP error', done => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of(mockToken));

    const errorMessage = 'Update failed';
    const mockError = {
      status: 400,
      statusText: 'Bad Request',
      error: { message: errorMessage },
    };

    service.update(mockCustomerId, mockUpdateCustomer).subscribe({
      next: () => fail('Expected error'),
      error: error => {
        expect(error.status).toBe(400);
        expect(toastServiceSpy.error).toHaveBeenCalledWith(errorMessage);
        done();
      },
    });

    const request = httpTestingController.expectOne(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${mockCustomerId}`,
    );
    request.flush(mockError.error, mockError);
  });

  it('should throw error immediately if no access token', done => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of(null));

    service.update(mockCustomerId, mockUpdateCustomer).subscribe({
      next: () => fail('Expected error'),
      error: error => {
        expect(error.message).toBe('No access token available');
        done();
      },
    });

    httpTestingController.expectNone(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${mockCustomerId}`,
    );
  });
});

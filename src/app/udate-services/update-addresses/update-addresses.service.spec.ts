import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { UpdateAddressesService } from './update-addresses.service';
import { of } from 'rxjs';
import { UpdateAddresses } from './update-addresses.interfaces';

describe('UpdateAddressesService', () => {
  let httpTestingController: HttpTestingController;
  let service: UpdateAddressesService;

  const mockToken = 'mock-token';
  const mockCustomerId = 'customer-123';

  const mockUpdateAddresses: UpdateAddresses = {
    version: 1,
    actions: [
      {
        action: 'addAddress',
        address: {
          streetName: 'Main St',
          postalCode: '12345',
          city: 'New York',
          country: 'US',
        },
      },
    ],
  };

  const mockResponse = {
    id: 'customer-123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    password: 'hashed-password',
    addresses: [
      {
        id: 'address-1',
        streetName: 'Main St',
        postalCode: '12345',
        city: 'New York',
        country: 'US',
      },
    ],
    shippingAddressIds: ['address-1'],
    billingAddressIds: ['address-1'],
    version: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateAddressesService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UpdateAddressesService);
    spyOn(service.ctpApiService, 'getAccessToken').and.returnValue(of(mockToken));
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request and return updated customer', done => {
    service.update(mockCustomerId, mockUpdateAddresses).subscribe({
      next: response => {
        expect(response).toEqual(mockResponse);
        done();
      },
    });

    const request = httpTestingController.expectOne(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${mockCustomerId}`,
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(request.request.headers.get('Content-Type')).toBe('application/json');
    expect(request.request.body).toEqual(mockUpdateAddresses);

    request.flush(mockResponse);
  });
});

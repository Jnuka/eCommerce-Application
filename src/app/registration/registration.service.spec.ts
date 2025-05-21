import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let httpTestingController: HttpTestingController;
  let service: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistrationService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RegistrationService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

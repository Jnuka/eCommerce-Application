import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { UpdatePasswordService } from './update-password.service';

describe('UpdatePasswordService', () => {
  let httpTestingController: HttpTestingController;

  let service: UpdatePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdatePasswordService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(UpdatePasswordService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

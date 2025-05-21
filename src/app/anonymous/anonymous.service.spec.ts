import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AnonymousService } from './anonymous.service';

describe('AnonymousService', () => {
  let httpTestingController: HttpTestingController;
  let service: AnonymousService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AnonymousService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { CartActionsService } from './cart-actions.service';

describe('CartActionsService', () => {
  let httpTestingController: HttpTestingController;

  let service: CartActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartActionsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

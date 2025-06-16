import { TestBed } from '@angular/core/testing';

import { CartActionsService } from './cart-actions.service';

describe('CartActionsService', () => {
  let service: CartActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

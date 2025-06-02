import { TestBed } from '@angular/core/testing';

import { UpdateAddressesService } from './update-addresses.service';

describe('UpdateAddressesService', () => {
  let service: UpdateAddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateAddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

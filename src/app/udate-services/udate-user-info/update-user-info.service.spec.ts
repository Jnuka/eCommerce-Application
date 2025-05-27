import { TestBed } from '@angular/core/testing';

import { UpdateUserInfoService } from './update-user-info.service';

describe('UpdateUserInfoService', () => {
  let service: UpdateUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

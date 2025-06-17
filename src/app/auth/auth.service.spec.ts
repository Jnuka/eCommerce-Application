import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { CtpApiService } from '../data/services/ctp-api.service';
import { of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let httpTestingController: HttpTestingController;
  let service: AuthService;
  const cookieServiceSpy = jasmine.createSpyObj<CookieService>('CookieService', [
    'get',
    'set',
    'delete',
    'deleteAll',
  ]);
  const ctpApiServiceSpy = jasmine.createSpyObj<CtpApiService>('CtpApiService', ['getAccessToken']);
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CtpApiService, useValue: ctpApiServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error when access token is null', done => {
    ctpApiServiceSpy.getAccessToken.and.returnValue(of(null));
    service.login({ email: 'test@test.com', password: 'pass' }).subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('No access token available');
        done();
      },
    });
  });

  it('should call logout on refresh token failure', done => {
    service.refreshToken = 'invalid-refresh';
    spyOn(service['http'], 'post').and.returnValue(throwError(() => ({ status: 400 })));
    const logoutSpy = spyOn(service, 'logout');

    service.refreshAuthToken().subscribe({
      error: () => {
        expect(logoutSpy).toHaveBeenCalled();
        done();
      },
    });
  });
  it('should read token from cookies if not already in memory', () => {
    cookieServiceSpy.get.withArgs('token').and.returnValue('cookie-token');
    cookieServiceSpy.get.withArgs('refreshToken').and.returnValue('cookie-refresh');

    expect(service.isAuth).toBeTrue();
  });
  it('should return current customerToken and refreshToken', () => {
    service.customerToken = 'token123';
    service.refreshToken = 'refresh123';

    expect(service.getCustomerToken()).toBe('token123');
    expect(service.getRefreshToken()).toBe('refresh123');
  });

  it('should call logout and delete all cookies', () => {
    service.logout();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cookieServiceSpy.deleteAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});

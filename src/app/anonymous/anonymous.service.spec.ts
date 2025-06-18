import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AnonymousService } from './anonymous.service';
import { CookieService } from 'ngx-cookie-service';

describe('AnonymousService', () => {
  let httpTestingController: HttpTestingController;
  let service: AnonymousService;
  let cookieSpyObject: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieSpyObject = jasmine.createSpyObj<CookieService>('CookieService', [
      'get',
      'set',
      'delete',
    ]);

    cookieSpyObject.get.and.callFake((key: string) => {
      const cookies: Record<string, string> = {
        anonymous_id: 'test-anonymous-id',
        anonymous_token: 'test-anonymous-access-token',
        anonymous_refresh_token: 'test-anonymous-refresh-token',
      };
      return cookies[key] || '';
    });

    TestBed.configureTestingModule({
      providers: [
        AnonymousService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: cookieSpyObject },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AnonymousService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return anonymousId from cookie', () => {
    expect(service.getAnonymousId()).toContain('test-anonymous-id');
  });

  it('should return access and refresh anonymous tokens', () => {
    expect(service.getToken()).toBe('test-anonymous-access-token');
    expect(service.getRefreshToken()).toBe('test-anonymous-refresh-token');
  });

  it('should have anonymousId from cookie or generated', () => {
    const id = service.getAnonymousId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('logout delete tokens', () => {
    service.logout();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cookieSpyObject.delete).toHaveBeenCalledWith('anonymous_token');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cookieSpyObject.delete).toHaveBeenCalledWith('anonymous_refresh_token');
  });
});

import { TestBed } from '@angular/core/testing';
import { CtpApiService } from './ctp-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastService } from '../../helpers/toast.service';
import { environment } from '../../../environments/environment';
import { AccessTokenResponse } from '../interfaces/ctp-api.interface';
/* eslint-disable */

describe('CtpApiService', () => {
  let service: CtpApiService;
  let httpMock: HttpTestingController;
  const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CtpApiService, { provide: ToastService, useValue: toastServiceSpy }],
    });

    service = TestBed.inject(CtpApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAccessToken should emit current token value', done => {
    (service as CtpApiService).accessToken$.next('mock_token');

    service.getAccessToken().subscribe(token => {
      expect(token).toBe('mock_token');
      done();
    });
  });

  it('init should call initAccessToken', () => {
    const typedService = service as unknown as { initAccessToken: () => void };
    const spy = spyOn(typedService, 'initAccessToken');
    service.init();
    expect(spy).toHaveBeenCalled();
  });

  it('should store access token on successful response', () => {
    service.init();

    const request = httpMock.expectOne(`${environment.ctp_auth_url}/oauth/token`);
    expect(request.request.method).toBe('POST');

    const mockResponse: AccessTokenResponse = {
      access_token: 'test_token',
      expires_in: 3600,
      scope: '',
      token_type: 'Bearer',
    };

    request.flush(mockResponse);

    service.getAccessToken().subscribe(token => {
      expect(token).toBe('test_token');
    });
  });

  it('should show toast error on failed access token request', () => {
    service.init();

    const request = httpMock.expectOne(`${environment.ctp_auth_url}/oauth/token`);
    expect(request.request.method).toBe('POST');

    request.flush('error', { status: 400, statusText: 'Bad Request' });

    expect(toastServiceSpy.error).toHaveBeenCalledWith('Error receiving access token');
  });
});

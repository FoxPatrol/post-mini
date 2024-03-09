import { TestBed } from '@angular/core/testing';

import { LoadingState, RequestDataService } from './request-data.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('RequestDataService', () => {
  let service: RequestDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(RequestDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loadingState when sendRequest is called', async () => {
    const rdServiceSetSpy = jest.spyOn(service.state, 'set');

    //@ts-ignore ignore error on private property
    const httpSpy = jest.spyOn(service.http, 'request');
    httpSpy.mockReturnValue(of({}));

    const req = service.sendRequest('get', 'http://url.com');

    // should be loading
    expect(rdServiceSetSpy).toHaveBeenCalledWith(LoadingState.Loading);

    // wait for finish loading, should have loaded
    await req;
    expect(rdServiceSetSpy).toHaveBeenCalledWith(LoadingState.Loaded);

    httpSpy.mockRestore();
  });

  it('should set loadingState to Error when sendRequest encounters an error', async () => {
    const rdServiceSetSpy = jest.spyOn(service.state, 'set');

    //@ts-ignore ignore error on private property
    const httpSpy = jest.spyOn(service.http, 'request');
    const errorResponse = new Error('Simulated error');

    // Simulate a delayed error response (200ms delay)
    httpSpy.mockReturnValue(throwError(() => of(errorResponse)));

    const req = service.sendRequest('get', 'http://url.com');
    expect(rdServiceSetSpy).toHaveBeenCalledWith(LoadingState.Loading);

    await req;
    expect(rdServiceSetSpy).toHaveBeenCalledWith(LoadingState.Error);

    httpSpy.mockRestore();
  });
});

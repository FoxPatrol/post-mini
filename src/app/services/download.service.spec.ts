import { TestBed } from '@angular/core/testing';

import { DownloadService } from './download.service';

describe('DownloadService', () => {
  let service: DownloadService;

  window.URL.createObjectURL = jest.fn();
  window.URL.revokeObjectURL = jest.fn();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not create a download link if text is not provided', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');

    service.downloadToFile('');

    expect(createElementSpy).not.toHaveBeenCalled();
  });

  it('should create and trigger a download link with correct properties', () => {
    const text = 'Hello, test world!';
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    service.downloadToFile(text);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});

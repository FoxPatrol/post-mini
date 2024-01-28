import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequestCardComponent } from './http-request-card.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

enum LoadingState {
  Default,
  Loading,
  Loaded,
  Error,
}

type NameValuePair = {
  name: string;
  value: string;
};

describe('HttpRequestCardComponent', () => {
  let component: HttpRequestCardComponent;
  let fixture: ComponentFixture<HttpRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpRequestCardComponent,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HttpRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the form as invalid if the URL is missing or invalid', () => {
    const urlControl = component.requestForm.get('url');

    // Test invalid URL
    urlControl?.setValue('invalid-url');
    expect(component.requestForm.valid).toBeFalsy();

    // Test missing URL
    urlControl?.setValue('');
    expect(component.requestForm.valid).toBeFalsy();
  });

  it('should update the number of lines when calling updateNumberOfLines', () => {
    const text = 'line 1\nline 2\nline 3';
    component.updateNumberOfLines({ target: { value: text } });

    expect(component.arrayOfNumberOfLines.length).toBe(3);
  });

  it('should update the number of lines to 0 when text is empty', () => {
    const emptyText = '';

    component.updateNumberOfLines({ target: { value: emptyText } });

    expect(component.arrayOfNumberOfLines.length).toBe(0);
    expect(component.arrayOfNumberOfLines).toEqual([]);
  });

  it('should clean the string by removing trailing whitespaces and quotes', () => {
    const dirtyString = '  "  test  "  ';
    const cleanedString = component.cleanString(dirtyString);

    expect(cleanedString).toBe('test');
  });

  it('should set loadingState when sendRequest is called', async () => {
    // should start as default
    expect(component.loadingState).toBe(LoadingState.Default);

    // @ts-ignore
    const httpSpy = jest.spyOn(component.http, 'request');
    httpSpy.mockReturnValue(of({}));

    const req = component.sendRequest();

    // should be loading
    expect(component.loadingState).toBe(LoadingState.Loading);

    // wait for finish loading, should have loaded
    await req;
    expect(component.loadingState).toBe(LoadingState.Loaded);

    httpSpy.mockRestore();
  });

  it('should set loadingState to Error when sendRequest encounters an error', async () => {
    // should start as default
    expect(component.loadingState).toBe(LoadingState.Default);

    // @ts-ignore
    const httpSpy = jest.spyOn(component.http, 'request');
    const errorResponse = new Error('Simulated error');

    // Simulate a delayed error response (200ms delay)
    httpSpy.mockReturnValue(throwError(() => of(errorResponse)));

    const req = component.sendRequest();
    expect(component.loadingState).toBe(LoadingState.Loading);

    await req;
    expect(component.loadingState).toBe(LoadingState.Error);

    httpSpy.mockRestore();
  });

  it('should convert an array of NameValuePair to a dictionary', () => {
    const headersArray: NameValuePair[] = [
      { name: 'Header1', value: 'Value1' },
      { name: 'Header2', value: 'Value2' },
    ];
    const result = component.arrayToDictionary(headersArray);
    expect(result).toEqual({ Header1: 'Value1', Header2: 'Value2' });
  });

  it('should ignore header object if it has empty name', () => {
    const headersArray: NameValuePair[] = [
      { name: 'Header1', value: 'Value1' },
      { name: '', value: 'Value2' },
    ];
    const result = component.arrayToDictionary(headersArray);
    expect(result).toEqual({ Header1: 'Value1' });
  });

  it('should convert an array of NameValuePair to a dictionary for params', () => {
    const paramsArray: NameValuePair[] = [
      { name: 'param1', value: 'value1' },
      { name: 'param2', value: 'value2' },
    ];
    const result = component.paramsToUrl(paramsArray);
    expect(result).toEqual({ param1: 'value1', param2: 'value2' });
  });

  it('should ignore a param object if it has empty name', () => {
    const paramsArray: NameValuePair[] = [
      { name: '', value: 'value1' },
      { name: 'param2', value: 'value2' },
    ];
    const result = component.paramsToUrl(paramsArray);
    expect(result).toEqual({ param2: 'value2' });
  });

  it('should return null for a valid URL', () => {
    const validUrl = 'https://example.com';
    // @ts-ignore
    const result = component.urlValidator(new FormControl(validUrl));
    expect(result).toBeNull();
  });

  it('should return an error for an invalid URL', () => {
    const invalidUrl = 'invalid-url';
    // @ts-ignore
    const result = component.urlValidator(new FormControl(invalidUrl));
    expect(result).toEqual({ invalidUrl: true });
  });

  it('should set headerCount to the specified value', () => {
    const count = 5;
    component.setHeaderCount(count);
    expect(component.headerCount).toBe(count);
  });

  it('should set paramCount to the specified value', () => {
    const count = 8;
    component.setParamCount(count);
    expect(component.paramCount).toBe(count);
  });

  it('should copy text to clipboard', () => {
    const bodyText = 'Test text';
    component.body.setValue(bodyText);

    const clipboardWriteTextMock = jest.fn();
    const originalClipboard = { ...navigator.clipboard }; // Create a copy of the original clipboard

    // Mock the navigator object
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: { writeText: clipboardWriteTextMock },
    });

    component.copyToClipboard();

    expect(clipboardWriteTextMock).toHaveBeenCalledWith(bodyText);

    // Restore the original navigator object
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: originalClipboard,
    });
  });

  it('should read file content and set it to body when uploadFromFile is called', () => {
    const fileContent = 'File content';
    const mockFile = new File([fileContent], 'test.txt', {
      type: 'text/plain',
    });

    const event = {
      target: {
        files: [mockFile],
      },
    } as any;

    const mockFileReader = {
      onload: jest.fn(),
      readAsText: jest.fn(),
    } as any;
    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);
    component.uploadFromFile(event);

    fixture.whenStable().then(() => {
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
      expect(component.body.value).toBe(fileContent);
    });
  });

  it('should reset file input value when uploadFromFile is called', () => {
    const event = {
      target: {
        value: 'file.txt',
      },
    } as any;

    component.uploadFromFile(event);
    expect(event.target.value).toBeNull();
  });
});

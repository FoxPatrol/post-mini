import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadFromFileButtonComponent } from './load-from-file-button.component';

describe('LoadFromFileButtonComponent', () => {
  let component: LoadFromFileButtonComponent;
  let fixture: ComponentFixture<LoadFromFileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadFromFileButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadFromFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const emitSpy = jest.spyOn(component.loadedContent, 'emit');
    component.uploadFromFile(event);

    fixture.whenStable().then(() => {
      expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
      expect(emitSpy).toBe(fileContent);
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

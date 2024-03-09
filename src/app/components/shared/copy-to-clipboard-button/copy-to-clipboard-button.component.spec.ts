import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyToClipboardButtonComponent } from './copy-to-clipboard-button.component';

describe('CopyToClipboardButtonComponent', () => {
  let component: CopyToClipboardButtonComponent;
  let fixture: ComponentFixture<CopyToClipboardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyToClipboardButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyToClipboardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy text to clipboard', () => {
    const bodyText = 'Test text';
    component.copyTarget = bodyText;

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
});

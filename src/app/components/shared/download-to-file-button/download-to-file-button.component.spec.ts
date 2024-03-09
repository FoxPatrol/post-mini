import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadToFileButtonComponent } from './download-to-file-button.component';

describe('DownloadToFileButtonComponent', () => {
  let component: DownloadToFileButtonComponent;
  let fixture: ComponentFixture<DownloadToFileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadToFileButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadToFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

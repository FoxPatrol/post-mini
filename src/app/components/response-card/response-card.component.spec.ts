import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseCardComponent } from './response-card.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ResponseCardComponent', () => {
  let component: ResponseCardComponent;
  let fixture: ComponentFixture<ResponseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResponseCardComponent,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

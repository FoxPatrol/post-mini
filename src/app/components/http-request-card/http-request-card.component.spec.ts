import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpRequestCardComponent } from './http-request-card.component';

describe('HttpRequestCardComponent', () => {
  let component: HttpRequestCardComponent;
  let fixture: ComponentFixture<HttpRequestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpRequestCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HttpRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

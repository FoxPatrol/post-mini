import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCodeChipComponent } from './status-code-chip.component';

describe('StatusCodeChipComponent', () => {
  let component: StatusCodeChipComponent;
  let fixture: ComponentFixture<StatusCodeChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCodeChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusCodeChipComponent);
    component = fixture.componentInstance;
    component.statusCode = '200';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

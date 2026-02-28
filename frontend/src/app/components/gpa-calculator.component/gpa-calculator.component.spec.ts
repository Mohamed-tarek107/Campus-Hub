import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpaCalculatorComponent } from './gpa-calculator.component';

describe('GpaCalculatorComponent', () => {
  let component: GpaCalculatorComponent;
  let fixture: ComponentFixture<GpaCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpaCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpaCalculatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

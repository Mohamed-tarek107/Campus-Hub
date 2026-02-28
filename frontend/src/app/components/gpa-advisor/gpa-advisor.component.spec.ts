import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpaAdvisorComponent } from './gpa-advisor.component';

describe('GpaAdvisorComponent', () => {
  let component: GpaAdvisorComponent;
  let fixture: ComponentFixture<GpaAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpaAdvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpaAdvisorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

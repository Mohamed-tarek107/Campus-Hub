import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedbacksComponent } from './feedbacks.component';

describe('FeedbacksComponent', () => {
  let component: AdminFeedbacksComponent;
  let fixture: ComponentFixture<AdminFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFeedbacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFeedbacksComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

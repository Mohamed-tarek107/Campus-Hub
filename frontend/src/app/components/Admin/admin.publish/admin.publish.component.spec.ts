import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublishComponent } from './admin.publish.component';

describe('AdminEventsComponent', () => {
  let component: AdminPublishComponent;
  let fixture: ComponentFixture<AdminPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPublishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPublishComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

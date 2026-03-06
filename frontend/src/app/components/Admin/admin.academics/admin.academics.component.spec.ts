import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAcademicsComponent } from './admin.academics.component';

describe('AdminAcademicsComponent', () => {
  let component: AdminAcademicsComponent;
  let fixture: ComponentFixture<AdminAcademicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAcademicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAcademicsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

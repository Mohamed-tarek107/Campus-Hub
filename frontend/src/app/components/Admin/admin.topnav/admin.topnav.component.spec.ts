import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopnavComponent } from './admin.topnav.component';

describe('AdminTopnavComponent', () => {
  let component: AdminTopnavComponent;
  let fixture: ComponentFixture<AdminTopnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTopnavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTopnavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

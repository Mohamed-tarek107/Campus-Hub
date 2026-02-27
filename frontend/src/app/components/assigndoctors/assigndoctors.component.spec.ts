import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigndoctorsComponent } from './assigndoctors.component';

describe('AssigndoctorsComponent', () => {
  let component: AssigndoctorsComponent;
  let fixture: ComponentFixture<AssigndoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigndoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigndoctorsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

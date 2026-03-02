import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorsComponent } from './edit-doctors.component';

describe('EditDoctorsComponent', () => {
  let component: EditDoctorsComponent;
  let fixture: ComponentFixture<EditDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoctorsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

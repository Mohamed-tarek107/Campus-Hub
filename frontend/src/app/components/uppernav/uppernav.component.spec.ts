import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UppernavComponent } from './uppernav.component';

describe('UppernavComponent', () => {
  let component: UppernavComponent;
  let fixture: ComponentFixture<UppernavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UppernavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UppernavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

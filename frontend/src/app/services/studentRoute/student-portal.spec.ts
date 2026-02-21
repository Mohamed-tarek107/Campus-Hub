import { TestBed } from '@angular/core/testing';

import { StudentPortal } from './student-portal';

describe('StudentPortal', () => {
  let service: StudentPortal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPortal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

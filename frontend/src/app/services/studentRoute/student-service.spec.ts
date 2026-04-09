import { TestBed } from '@angular/core/testing';

import { StudentService } from '../studentRoute/student-service';

describe('DashboardService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

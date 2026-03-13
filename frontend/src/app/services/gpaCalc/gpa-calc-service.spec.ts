import { TestBed } from '@angular/core/testing';

import { GpaCalcService } from './gpa-calc-service';

describe('GpaCalcService', () => {
  let service: GpaCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpaCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

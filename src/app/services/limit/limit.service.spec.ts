import {TestBed} from '@angular/core/testing';

import {LimitService} from './limit.service';

describe('LimitService', () => {
  let service: LimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

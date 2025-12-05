import {TestBed} from '@angular/core/testing';

import {LocalerouteService} from './localeroute.service';

describe('LocalerouteService', () => {
  let service: LocalerouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalerouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

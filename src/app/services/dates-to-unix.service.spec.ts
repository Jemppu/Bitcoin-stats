import { TestBed } from '@angular/core/testing';

import { DatesToUnixService } from './dates-to-unix.service';

describe('DatesToUnixService', () => {
  let service: DatesToUnixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatesToUnixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

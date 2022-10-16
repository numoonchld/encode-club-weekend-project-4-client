import { TestBed } from '@angular/core/testing';

import { GoerliService } from './goerli.service';

describe('GoerliService', () => {
  let service: GoerliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoerliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

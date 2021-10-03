import { TestBed } from '@angular/core/testing';

import { ClearRecordsService } from './clear-records.service';

describe('ClearRecordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClearRecordsService = TestBed.get(ClearRecordsService);
    expect(service).toBeTruthy();
  });
});

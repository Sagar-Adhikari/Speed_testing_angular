import { TestBed } from '@angular/core/testing';

import { SpeedTestService } from './speed-test.service';

describe('SpeedTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeedTestService = TestBed.get(SpeedTestService);
    expect(service).toBeTruthy();
  });
});

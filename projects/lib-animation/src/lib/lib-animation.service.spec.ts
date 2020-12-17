import { TestBed } from '@angular/core/testing';

import { LibAnimationService } from './lib-animation.service';

describe('LibAnimationService', () => {
  let service: LibAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

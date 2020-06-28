import { TestBed } from '@angular/core/testing';

import { MusicMapService } from './music-map.service';

describe('MusicMapService', () => {
  let service: MusicMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

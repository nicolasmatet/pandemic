import { TestBed } from '@angular/core/testing';

import { PlayroomsocketService } from './playroomsocket.service';

describe('PlayroomsocketService', () => {
  let service: PlayroomsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayroomsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

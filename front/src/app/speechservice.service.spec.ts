import { TestBed } from '@angular/core/testing';

import { SpeechserviceService } from './speechservice.service';

describe('SpeechserviceService', () => {
  let service: SpeechserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

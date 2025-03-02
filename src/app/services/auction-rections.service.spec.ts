import { TestBed } from '@angular/core/testing';

import { AuctionRectionsService } from './auction-rections.service';

describe('AuctionRectionsService', () => {
  let service: AuctionRectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionRectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

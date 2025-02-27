import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionRequestsTableComponent } from './auction-requests-table.component';

describe('AuctionRequestsTableComponent', () => {
  let component: AuctionRequestsTableComponent;
  let fixture: ComponentFixture<AuctionRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionRequestsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
